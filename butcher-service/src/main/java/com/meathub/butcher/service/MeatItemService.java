package com.meathub.butcher.service;

import com.meathub.butcher.dto.MeatItemRequest;
import com.meathub.butcher.dto.MeatItemResponse;
import com.meathub.butcher.entity.Butcher;
import com.meathub.butcher.entity.MeatItem;
import com.meathub.butcher.exception.ButcherNotFoundException;
import com.meathub.butcher.exception.MeatItemNotFoundException;
import com.meathub.butcher.repository.ButcherRepository;
import com.meathub.butcher.repository.MeatItemRepository;
import com.meathub.butcher.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeatItemService {

    @Autowired
    private MeatItemRepository meatItemRepository;

    @Autowired
    private ButcherRepository butcherRepository;

    public MeatItemResponse createMeatItem(MeatItemRequest request) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Butcher butcher = butcherRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ButcherNotFoundException("Butcher profile not found for current user"));

        MeatItem item = new MeatItem();
        item.setButcher(butcher);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setStatus("AVAILABLE");

        MeatItem saved = meatItemRepository.save(item);
        return mapToResponse(saved);
    }

    public List<MeatItemResponse> getMyMeatItems() {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Butcher butcher = butcherRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ButcherNotFoundException("Butcher profile not found"));

        return meatItemRepository.findByButcherId(butcher.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MeatItemResponse> getMeatItemsByButcher(Long butcherId) {
        return meatItemRepository.findByButcherId(butcherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // NEW: Get all available meat items for the marketplace
    public List<MeatItemResponse> getAllAvailableItems() {
        return meatItemRepository.findByStatus("AVAILABLE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search and filter meat items
    public List<MeatItemResponse> searchItems(String name, String category, 
                                               java.math.BigDecimal minPrice, 
                                               java.math.BigDecimal maxPrice,
                                               Long butcherId) {
        List<MeatItem> items;
        
        if (butcherId != null) {
            // Filter by butcher first
            if (category != null && !category.isEmpty()) {
                items = meatItemRepository.findByButcherIdAndCategoryAndStatus(butcherId, category, "AVAILABLE");
            } else {
                items = meatItemRepository.findByButcherId(butcherId).stream()
                        .filter(item -> "AVAILABLE".equals(item.getStatus()))
                        .collect(Collectors.toList());
            }
            
            // Apply name filter if provided
            if (name != null && !name.isEmpty()) {
                items = items.stream()
                        .filter(item -> item.getName().toLowerCase().contains(name.toLowerCase()))
                        .collect(Collectors.toList());
            }
            
            // Apply price filter if provided
            if (minPrice != null || maxPrice != null) {
                items = items.stream()
                        .filter(item -> {
                            if (minPrice != null && item.getPrice().compareTo(minPrice) < 0) return false;
                            if (maxPrice != null && item.getPrice().compareTo(maxPrice) > 0) return false;
                            return true;
                        })
                        .collect(Collectors.toList());
            }
        } else {
            // Use repository search method
            items = meatItemRepository.searchItems(
                    name != null && !name.isEmpty() ? name : null,
                    category != null && !category.isEmpty() ? category : null,
                    minPrice,
                    maxPrice,
                    "AVAILABLE"
            );
        }
        
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MeatItemResponse updateMeatItem(Long id, MeatItemRequest request) {
        MeatItem item = meatItemRepository.findById(id)
                .orElseThrow(() -> new MeatItemNotFoundException("Item not found"));

        // Add ownership check here in real PROD
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setCategory(request.getCategory());
        if (request.getImageUrl() != null)
            item.setImageUrl(request.getImageUrl());

        return mapToResponse(meatItemRepository.save(item));
    }

    public void deleteMeatItem(Long id) {
        meatItemRepository.deleteById(id);
    }

    private MeatItemResponse mapToResponse(MeatItem item) {
        MeatItemResponse response = new MeatItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setQuantity(item.getQuantity());
        response.setCategory(item.getCategory());
        response.setImageUrl(item.getImageUrl());
        
        // Safely handle butcher relationship
        if (item.getButcher() != null) {
            response.setButcherName(item.getButcher().getShopName());
            response.setButcherId(item.getButcher().getId());
        }
        
        return response;
    }
}
