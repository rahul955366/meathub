package com.meatup.pet.repository;

import com.meatup.pet.entity.PetProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetProductRepository extends JpaRepository<PetProduct, Long> {
    List<PetProduct> findByButcherId(Long butcherId);

    List<PetProduct> findByIsAvailableTrue();
}
