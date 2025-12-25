package com.meathub.butcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeatItemResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String category;
    private String imageUrl;
    private String butcherName;
    private Long butcherId;

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setButcherName(String butcherName) {
        this.butcherName = butcherName;
    }

    public void setButcherId(Long butcherId) {
        this.butcherId = butcherId;
    }
}
