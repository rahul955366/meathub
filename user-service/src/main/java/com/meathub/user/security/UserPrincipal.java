package com.meathub.user.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;

public class UserPrincipal extends org.springframework.security.core.userdetails.User {

    private final Long userId;

    public UserPrincipal(String username, Long userId, Collection<? extends GrantedAuthority> authorities) {
        super(username, "", authorities);
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}
