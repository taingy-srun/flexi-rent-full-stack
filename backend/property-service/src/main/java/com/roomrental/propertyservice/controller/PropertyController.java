package com.roomrental.propertyservice.controller;

import com.roomrental.propertyservice.dto.PropertyCreateRequest;
import com.roomrental.propertyservice.model.Property;
import com.roomrental.propertyservice.model.PropertyType;
import com.roomrental.propertyservice.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public ResponseEntity<Property> createProperty(@Valid @RequestBody PropertyCreateRequest request) {
        Property property = propertyService.createProperty(request);
        return ResponseEntity.ok(property);
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = propertyService.getPropertyById(id);
        return property.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<Property>> getPropertiesByLandlord(@PathVariable Long landlordId) {
        List<Property> properties = propertyService.getPropertiesByLandlord(landlordId);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Property>> getAvailableProperties() {
        List<Property> properties = propertyService.getAvailableProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Property> properties = propertyService.searchProperties(city, minPrice, maxPrice, bedrooms, propertyType, pageable);
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id,
                                                 @Valid @RequestBody PropertyCreateRequest request) {
        Property updatedProperty = propertyService.updateProperty(id, request);
        if (updatedProperty != null) {
            return ResponseEntity.ok(updatedProperty);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Property> updateAvailability(@PathVariable Long id,
                                                      @RequestParam Boolean available) {
        Property updatedProperty = propertyService.updateAvailability(id, available);
        if (updatedProperty != null) {
            return ResponseEntity.ok(updatedProperty);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        boolean deleted = propertyService.deleteProperty(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}