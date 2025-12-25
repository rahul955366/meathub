package com.meathub.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserInfo {
    private String sub; // Google user ID
    private String email;
    private String name;
    private String picture;
    private Boolean email_verified;
}
