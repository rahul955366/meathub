package com.meathub.butcher.dto;

public class ButcherResponse {
    private Long id;
    private Long userId;
    private String shopName;
    private String address;
    private String phoneNumber;
    private String description;
    private String status;

    public ButcherResponse() {
    }

    public ButcherResponse(Long id, Long userId, String shopName, String address, String phoneNumber,
            String description, String status) {
        this.id = id;
        this.userId = userId;
        this.shopName = shopName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
