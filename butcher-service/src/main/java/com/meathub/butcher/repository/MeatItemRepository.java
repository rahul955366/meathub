package com.meathub.butcher.repository;

import com.meathub.butcher.entity.MeatItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeatItemRepository extends JpaRepository<MeatItem, Long> {
    List<MeatItem> findByButcherId(Long butcherId);

    List<MeatItem> findByStatus(String status);
}
