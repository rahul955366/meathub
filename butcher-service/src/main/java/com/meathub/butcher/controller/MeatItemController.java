package com.meathub.butcher.controller;

import com.meathub.butcher.dto.MeatItemRequest;
import com.meathub.butcher.dto.MeatItemResponse;
import com.meathub.butcher.service.MeatItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/butchers/items")
public class MeatItemController {

    @Autowired
    private MeatItemService meatItemService;

    @PostMapping
    public ResponseEntity<MeatItemResponse> createMeatItem(@Valid @RequestBody MeatItemRequest request) {
        MeatItemResponse response = meatItemService.createMeatItem(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<MeatItemResponse>> getMyMeatItems() {
        List<MeatItemResponse> items = meatItemService.getMyMeatItems();
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeatItemResponse> updateMeatItem(
            @PathVariable Long id,
            @Valid @RequestBody MeatItemRequest request) {
        MeatItemResponse response = meatItemService.updateMeatItem(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeatItem(@PathVariable Long id) {
        meatItemService.deleteMeatItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-butcher/{butcherId}")
    public ResponseEntity<List<MeatItemResponse>> getMeatItemsByButcher(@PathVariable Long butcherId) {
        List<MeatItemResponse> items = meatItemService.getMeatItemsByButcher(butcherId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MeatItemResponse>> getAllAvailableItems(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Long butcherId) {
        
        if (name != null || category != null || minPrice != null || maxPrice != null || butcherId != null) {
            return ResponseEntity.ok(meatItemService.searchItems(name, category, minPrice, maxPrice, butcherId));
        }
        
        return ResponseEntity.ok(meatItemService.getAllAvailableItems());
    }
}
