package com.meathub.user.repository;

import com.meathub.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserProfileUserId(Long userId);

    Optional<Address> findByIdAndUserProfileUserId(Long id, Long userId);
}
