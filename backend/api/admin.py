from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import (
    UserProfile, Address, Butcher, MeatItem, Subscription, 
    GymSubscription, PetSubscription, Order, OrderItem, 
    AIChatHistory, VillageSource
)

# Inline Admin for Addresses
class AddressInline(admin.StackedInline):
    model = Address
    extra = 0
    show_change_link = True

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

# Re-register UserAdmin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'gender', 'preferred_butcher_id')
    search_fields = ('user__username', 'first_name', 'last_name', 'phone')
    list_filter = ('gender', 'created_at')
    inlines = [AddressInline]

@admin.register(VillageSource)
class VillageSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'created_at')
    search_fields = ('name', 'location')

@admin.register(Butcher)
class ButcherAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'status', 'is_available', 'phone_number', 'city_source')
    list_filter = ('status', 'is_available', 'created_at')
    search_fields = ('shop_name', 'user__username', 'phone_number')
    actions = ['approve_butcher', 'reject_butcher', 'mark_unavailable']

    def city_source(self, obj):
        return obj.village_source.name if obj.village_source else '-'
    city_source.short_description = 'Source'

    def approve_butcher(self, request, queryset):
        queryset.update(status='APPROVED')
    approve_butcher.short_description = "Approve selected butchers"

    def reject_butcher(self, request, queryset):
        queryset.update(status='REJECTED')
    
    def mark_unavailable(self, request, queryset):
        queryset.update(is_available=False)

@admin.register(MeatItem)
class MeatItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'butcher', 'price', 'quantity', 'status', 'is_in_stock')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'butcher__shop_name')
    list_editable = ('price', 'quantity', 'status')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'butcher', 'meat_item_name', 'active', 'next_run_date', 'period')
    list_filter = ('active', 'period', 'delivery_option', 'next_run_date')
    search_fields = ('user__username', 'butcher__shop_name', 'meat_item_name')
    date_hierarchy = 'next_run_date'

@admin.register(GymSubscription)
class GymSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'meat_item_name', 'daily_quantity', 'active', 'next_delivery_date')
    list_filter = ('active', 'daily_quantity')

@admin.register(PetSubscription)
class PetSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'pet_type', 'product_name', 'schedule_type', 'active')
    list_filter = ('pet_type', 'active', 'schedule_type')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ('meat_item',)
    extra = 0
    readonly_fields = ('subtotal',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'butcher', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('id', 'user__username', 'butcher__shop_name', 'delivery_phone')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['mark_processing', 'mark_shipped', 'mark_delivered', 'mark_cancelled']

    def mark_processing(self, request, queryset):
        queryset.update(status='PROCESSING')
    
    def mark_shipped(self, request, queryset):
        queryset.update(status='SHIPPED')
        
    def mark_delivered(self, request, queryset):
        queryset.update(status='DELIVERED')

    def mark_cancelled(self, request, queryset):
        queryset.update(status='CANCELLED')

@admin.register(AIChatHistory)
class AIChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'context', 'short_message', 'created_at')
    list_filter = ('context', 'created_at')
    search_fields = ('user__username', 'message', 'response')
    readonly_fields = ('created_at',)

    def short_message(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    short_message.short_description = 'User Message'
