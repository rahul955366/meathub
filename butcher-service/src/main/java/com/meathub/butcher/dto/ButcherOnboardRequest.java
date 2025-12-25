package com.meathub.butcher.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ButcherOnboardRequest {
    @NotBlank
    private String shopName;
    @NotBlank
    private String address;
    @NotBlank
    private String phoneNumber;
    private String description;

    public String getShopName() {
        return shopName;
    }

    public String getAddress() {
        return address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getDescription() {
        return description;
    }
}
