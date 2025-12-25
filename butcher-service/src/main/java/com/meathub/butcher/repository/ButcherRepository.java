package com.meathub.butcher.repository;

import com.meathub.butcher.entity.Butcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ButcherRepository extends JpaRepository<Butcher, Long> {
    Optional<Butcher> findByUserId(Long userId);
    
    // Find nearby butchers using Haversine formula
    // Distance calculation: 6371 is Earth's radius in km
    @Query(value = "SELECT b.*, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(b.latitude)) * " +
            "cos(radians(b.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
            "sin(radians(b.latitude)))) AS distance " +
            "FROM butchers b " +
            "WHERE b.latitude IS NOT NULL AND b.longitude IS NOT NULL " +
            "AND b.status = 'APPROVED' AND b.is_available = true " +
            "HAVING distance <= COALESCE(:radius, b.service_radius_km, 10) " +
            "ORDER BY distance ASC", nativeQuery = true)
    List<Butcher> findNearbyButchers(@Param("lat") Double latitude, 
                                      @Param("lng") Double longitude, 
                                      @Param("radius") Double radiusKm);
    
    List<Butcher> findByStatusAndIsAvailable(String status, Boolean isAvailable);
}
