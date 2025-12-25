package com.meathub.user.service;

import com.meathub.user.dto.UserProfileRequest;
import com.meathub.user.dto.UserProfileResponse;
import com.meathub.user.entity.UserProfile;
import com.meathub.user.exception.UnauthorizedException;
import com.meathub.user.exception.UserProfileNotFoundException;
import com.meathub.user.repository.UserProfileRepository;
import com.meathub.user.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfileResponse getProfile(Long userId) {
        // Check authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal currentUser = (UserPrincipal) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        UserProfile profile;
        Long targetUserId = (userId != null) ? userId : currentUser.getUserId();

        if (userId != null && !isAdmin) {
            // Non-admin trying to view someone else's profile
            throw new UnauthorizedException("Only admins can view other user profiles");
        }

        // Get profile or create if doesn't exist
        profile = userProfileRepository.findByUserId(targetUserId)
                .orElseGet(() -> {
                    // Auto-create basic profile for user
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUserId(targetUserId);
                    newProfile.setFullName(currentUser.getUsername()); // Default to username
                    newProfile.setEmail(currentUser.getUsername() + "@meathub.com"); // Placeholder
                    newProfile.setPhone(""); // Empty initially
                    return userProfileRepository.save(newProfile);
                });

        return mapToResponse(profile);
    }

    @Transactional
    public UserProfileResponse createOrUpdateProfile(UserProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal currentUser = (UserPrincipal) auth.getPrincipal();
        Long userId = currentUser.getUserId();

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile());

        // Set userId if new profile
        if (profile.getId() == null) {
            profile.setUserId(userId);
        }

        // Update fields
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setBio(request.getBio());
        profile.setProfileImageUrl(request.getProfileImageUrl());
        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    @Transactional
    public UserProfileResponse setPreferredButcher(Long butcherId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal currentUser = (UserPrincipal) auth.getPrincipal();
        Long userId = currentUser.getUserId();

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUserId(userId);
                    newProfile.setFullName(currentUser.getUsername());
                    newProfile.setEmail(currentUser.getUsername() + "@meathub.com");
                    newProfile.setPhone("");
                    return userProfileRepository.save(newProfile);
                });

        profile.setPreferredButcherId(butcherId);
        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    public Long getPreferredButcher() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal currentUser = (UserPrincipal) auth.getPrincipal();
        Long userId = currentUser.getUserId();

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        return profile != null ? profile.getPreferredButcherId() : null;
    }

    @Transactional
    public void removePreferredButcher() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal currentUser = (UserPrincipal) auth.getPrincipal();
        Long userId = currentUser.getUserId();

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile != null) {
            profile.setPreferredButcherId(null);
            userProfileRepository.save(profile);
        }
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setFullName(profile.getFullName());
        response.setEmail(profile.getEmail());
        response.setPhone(profile.getPhone());
        response.setBio(profile.getBio());
        response.setProfileImageUrl(profile.getProfileImageUrl());
        response.setGender(profile.getGender());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
