import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import VillageSource, Butcher, MeatItem, UserProfile

def seed_data():
    print("Initializing Meathub Ecosystem...")
    
    # Create superuser if not exists
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')

    # Village Sources
    vs_organic, _ = VillageSource.objects.get_or_create(name="Meathub Organic Farms", location="Sangareddy")
    vs_sneha, _ = VillageSource.objects.get_or_create(name="Sneha Gold Farms", location="Telangana")
    vs_nellore, _ = VillageSource.objects.get_or_create(name="Nellore Coastal", location="AP")

    # 1. THE FLAGSHIP: MEATHUB STORE
    flagship_user, _ = User.objects.get_or_create(username='meathub_flagship')
    if not flagship_user.password:
        flagship_user.set_password('password')
        flagship_user.save()
    
    flagship_store, _ = Butcher.objects.update_or_create(
        user=flagship_user,
        defaults={
            'shop_name': 'MEATHUB FLAGSHIP STORE',
            'address': 'KPHB Main Road, Phase 3, Hyderabad',
            'phone_number': '9111111111',
            'description': 'The gold standard of meat. Live country chicken, artisanal mutton cuts, and precision hygiene. Watch our master butchers live.',
            'status': 'APPROVED',
            'village_source': vs_organic,
            'latitude': 17.4840,
            'longitude': 78.3889
        }
    )

    # Flagship Products
    flagship_items = [
        {"name": "Country Chicken (Natu Kodi)", "cat": "CHICKEN", "price": 650, "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80"},
        {"name": "Premium Broiler - Curry Cut", "cat": "CHICKEN", "price": 280, "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80"},
        {"name": "Potlam Mutton (Small Pack)", "cat": "MUTTON", "price": 950, "img": "https://images.unsplash.com/photo-1603048297172-c923170e2801?w=800&q=80"},
        {"name": "Pure Goat Mutton - Curry Cut", "cat": "MUTTON", "price": 880, "img": "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&q=80"},
        {"name": "Meathub Special Chicken Combo", "cat": "COMBO", "price": 1200, "img": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80"},
    ]

    for item in flagship_items:
        MeatItem.objects.update_or_create(
            butcher=flagship_store,
            name=item['name'],
            defaults={
                'category': item['cat'],
                'price': item['price'],
                'image_url': item['img'],
                'description': f"Premium {item['name']} from Meathub Flagship. Guaranteed freshness.",
                'quantity': 50,
                'status': 'AVAILABLE'
            }
        )

    # 2. MARKETPLACE BUTCHERS
    butchers_data = [
        {"user": "sneha_kphb", "name": "Sneha Fresh Chicken", "source": vs_sneha, "addr": "KPHB Road No 1", "lat": 17.4830, "lng": 78.3910, "img": "https://images.unsplash.com/photo-1516100882582-76c9a444dd5b?w=800&q=80"},
        {"user": "almadina_meat", "name": "Al-Madina Mutton Center", "source": vs_nellore, "addr": "KPHB Phase 1", "lat": 17.4810, "lng": 78.3950, "img": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80"},
        {"user": "vencobb_kphb", "name": "Vencobb Poultry", "source": vs_sneha, "addr": "KPHB Phase 6", "lat": 17.4950, "lng": 78.3880, "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80"},
    ]

    for b in butchers_data:
        u, _ = User.objects.get_or_create(username=b['user'])
        if not u.password:
            u.set_password('password')
            u.save()
        
        butcher, _ = Butcher.objects.update_or_create(
            user=u,
            defaults={
                'shop_name': b['name'],
                'address': b['addr'],
                'phone_number': '9848012345',
                'description': f"Local master butcher {b['name']} serving the KPHB community.",
                'status': 'APPROVED',
                'village_source': b['source'],
                'latitude': b['lat'],
                'longitude': b['lng']
            }
        )
        
        # Add products for these butchers — UNIQUE images per category
        cat_images = {
            "CHICKEN": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80",
            "MUTTON":  "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
            "FISH":    "https://images.unsplash.com/photo-1534604973900-c41ab4c5d4b0?w=800&q=80",
        }
        cat_prices = {"CHICKEN": 300, "MUTTON": 900, "FISH": 500}
        for cat in ["CHICKEN", "MUTTON", "FISH"]:
            MeatItem.objects.update_or_create(
                butcher=butcher,
                name=f"{b['name']} {cat.capitalize()}",
                defaults={
                    'category': cat,
                    'price': cat_prices[cat],
                    'image_url': cat_images[cat],
                    'description': f"High quality {cat.lower()} from {b['name']}.",
                    'quantity': 100,
                    'status': 'AVAILABLE'
                }
            )

    print("Meathub Ecosystem Initialized with Flagship Store.")

if __name__ == "__main__":
    seed_data()
