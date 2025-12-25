package com.meathub.user.service;

import com.meathub.user.dto.AddressRequest;
import com.meathub.user.dto.AddressResponse;
import com.meathub.user.entity.Address;
import com.meathub.user.entity.UserProfile;
import com.meathub.user.exception.AddressNotFoundException;
import com.meathub.user.exception.UnauthorizedException;
import com.meathub.user.exception.UserProfileNotFoundException;
import com.meathub.user.repository.AddressRepository;
import com.meathub.user.repository.UserProfileRepository;
import com.meathub.user.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<AddressResponse> getAllAddresses() {
        Long userId = getCurrentUserId();
        List<Address> addresses = addressRepository.findByUserProfileUserId(userId);
        return addresses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        Long userId = getCurrentUserId();

        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException(
                        "User profile not found. Please create a profile first."));

        Address address = new Address();
        address.setUserProfile(userProfile);
        mapRequestToEntity(request, address);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(userId);
        }

        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }

    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressRequest request) {
        Long userId = getCurrentUserId();

        Address address = addressRepository.findByIdAndUserProfileUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException("Address not found or unauthorized"));

        mapRequestToEntity(request, address);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(userId);
        }

        Address updatedAddress = addressRepository.save(address);
        return mapToResponse(updatedAddress);
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        Long userId = getCurrentUserId();
        boolean isAdmin = isCurrentUserAdmin();

        Address address;
        if (isAdmin) {
            // Admin can delete any address
            address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new AddressNotFoundException("Address not found"));
        } else {
            // Regular user can only delete own addresses
            address = addressRepository.findByIdAndUserProfileUserId(addressId, userId)
                    .orElseThrow(() -> new AddressNotFoundException("Address not found or unauthorized"));
        }

        addressRepository.delete(address);
    }

    private void unsetDefaultAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUserProfileUserId(userId);
        addresses.forEach(addr -> addr.setIsDefault(false));
        addressRepository.saveAll(addresses);
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private boolean isCurrentUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    private void mapRequestToEntity(AddressRequest request, Address address) {
        address.setAddressType(request.getAddressType());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setCountry(request.getCountry());
        address.setLandmark(request.getLandmark());
        address.setIsDefault(request.getIsDefault());
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setAddressType(address.getAddressType());
        response.setAddressLine1(address.getAddressLine1());
        response.setAddressLine2(address.getAddressLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setCountry(address.getCountry());
        response.setLandmark(address.getLandmark());
        response.setIsDefault(address.getIsDefault());
        response.setCreatedAt(address.getCreatedAt());
        response.setUpdatedAt(address.getUpdatedAt());
        return response;
    }
}
