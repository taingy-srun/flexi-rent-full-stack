package com.roomrental.propertyservice.service;

import com.roomrental.propertyservice.dto.PropertyCreateRequest;
import com.roomrental.propertyservice.model.Property;
import com.roomrental.propertyservice.model.PropertyType;
import com.roomrental.propertyservice.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public Property createProperty(PropertyCreateRequest request) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setCountry(request.getCountry());
        property.setPricePerMonth(request.getPricePerMonth());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setAreaSqft(request.getAreaSqft());
        property.setPropertyType(request.getPropertyType());
        property.setLandlordId(request.getLandlordId());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());

        if (request.getAmenities() != null) {
            property.setAmenities(request.getAmenities());
        }

        if (request.getImageUrls() != null) {
            property.setImageUrls(request.getImageUrls());
        }

        return propertyRepository.save(property);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> getPropertiesByLandlord(Long landlordId) {
        return propertyRepository.findByLandlordId(landlordId);
    }

    public List<Property> getAvailableProperties() {
        return propertyRepository.findByAvailable(true);
    }

    public Page<Property> searchProperties(String city, BigDecimal minPrice, BigDecimal maxPrice,
                                         Integer bedrooms, PropertyType propertyType, Pageable pageable) {
        return propertyRepository.findPropertiesWithFilters(city, minPrice, maxPrice, bedrooms, propertyType, pageable);
    }

    public Property updateProperty(Long id, PropertyCreateRequest request) {
        Optional<Property> existingProperty = propertyRepository.findById(id);
        if (existingProperty.isPresent()) {
            Property property = existingProperty.get();
            property.setTitle(request.getTitle());
            property.setDescription(request.getDescription());
            property.setAddress(request.getAddress());
            property.setCity(request.getCity());
            property.setState(request.getState());
            property.setZipCode(request.getZipCode());
            property.setCountry(request.getCountry());
            property.setPricePerMonth(request.getPricePerMonth());
            property.setBedrooms(request.getBedrooms());
            property.setBathrooms(request.getBathrooms());
            property.setAreaSqft(request.getAreaSqft());
            property.setPropertyType(request.getPropertyType());
            property.setLatitude(request.getLatitude());
            property.setLongitude(request.getLongitude());

            if (request.getAmenities() != null) {
                property.setAmenities(request.getAmenities());
            }

            if (request.getImageUrls() != null) {
                property.setImageUrls(request.getImageUrls());
            }

            return propertyRepository.save(property);
        }
        return null;
    }

    public boolean deleteProperty(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Property updateAvailability(Long id, Boolean available) {
        Optional<Property> existingProperty = propertyRepository.findById(id);
        if (existingProperty.isPresent()) {
            Property property = existingProperty.get();
            property.setAvailable(available);
            return propertyRepository.save(property);
        }
        return null;
    }
}