package com.meatup.pet.service;

import com.meatup.pet.dto.PetProductRequest;
import com.meatup.pet.entity.PetProduct;
import com.meatup.pet.exception.ProductNotFoundException;
import com.meatup.pet.repository.PetProductRepository;
import com.meatup.pet.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PetProductService {

    @Autowired
    private PetProductRepository petProductRepository;

    @Transactional
    public PetProduct createProduct(PetProductRequest request) {
        Long butcherId = getCurrentUserId();

        PetProduct product = new PetProduct();
        product.setButcherId(butcherId);
        product.setName(request.getName());
        product.setType(request.getType());
        product.setPricePerKg(request.getPricePerKg());
        product.setAvailableStockKg(request.getAvailableStockKg());
        product.setIsAvailable(true);

        return petProductRepository.save(product);
    }

    @Transactional
    public PetProduct updateProduct(Long productId, PetProductRequest request) {
        PetProduct product = petProductRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        // Ensure the butcher owns this product
        Long currentUserId = getCurrentUserId();
        if (!product.getButcherId().equals(currentUserId)) {
            // In a real app we'd throw UnauthorizedException, but keeping simple for now
            // or let security filter handle role, and here we check ownership
            throw new RuntimeException("Not authorized to update this product");
        }

        product.setName(request.getName());
        product.setType(request.getType());
        product.setPricePerKg(request.getPricePerKg());
        product.setAvailableStockKg(request.getAvailableStockKg());

        return petProductRepository.save(product);
    }

    public List<PetProduct> getAllAvailableProducts() {
        return petProductRepository.findByIsAvailableTrue();
    }

    public List<PetProduct> getMyProducts() {
        Long butcherId = getCurrentUserId();
        return petProductRepository.findByButcherId(butcherId);
    }

    public PetProduct getProductById(Long id) {
        return petProductRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }
}
