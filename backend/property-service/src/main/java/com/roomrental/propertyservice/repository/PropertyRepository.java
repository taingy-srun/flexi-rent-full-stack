package com.roomrental.propertyservice.repository;

import com.roomrental.propertyservice.model.Property;
import com.roomrental.propertyservice.model.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByLandlordId(Long landlordId);

    List<Property> findByAvailable(Boolean available);

    List<Property> findByCityIgnoreCase(String city);

    List<Property> findByPropertyType(PropertyType propertyType);

    @Query("SELECT p FROM Property p WHERE " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minPrice IS NULL OR p.pricePerMonth >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.pricePerMonth <= :maxPrice) AND " +
           "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
           "p.available = true")
    Page<Property> findPropertiesWithFilters(
            @Param("city") String city,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("propertyType") PropertyType propertyType,
            Pageable pageable);
}