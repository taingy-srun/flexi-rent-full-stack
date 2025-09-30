package com.roomrental.bookingservice.service;

import com.roomrental.bookingservice.dto.BookingCreateRequest;
import com.roomrental.bookingservice.model.Booking;
import com.roomrental.bookingservice.model.BookingStatus;
import com.roomrental.bookingservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(BookingCreateRequest request) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
            request.getPropertyId(), request.getStartDate(), request.getEndDate());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Property is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setPropertyId(request.getPropertyId());
        booking.setTenantId(request.getTenantId());
        booking.setLandlordId(request.getLandlordId());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setSpecialRequests(request.getSpecialRequests());

        return bookingRepository.save(booking);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByTenant(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId);
    }

    public List<Booking> getBookingsByLandlord(Long landlordId) {
        return bookingRepository.findByLandlordId(landlordId);
    }

    public List<Booking> getBookingsByProperty(Long propertyId) {
        return bookingRepository.findByPropertyId(propertyId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking updateBookingStatus(Long id, BookingStatus status) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);
        if (existingBooking.isPresent()) {
            Booking booking = existingBooking.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }

    public boolean isPropertyAvailable(Long propertyId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(propertyId, startDate, endDate);
        return conflictingBookings.isEmpty();
    }

    public List<Booking> getActiveBookingsForProperty(Long propertyId) {
        return bookingRepository.findActiveBookingsForProperty(propertyId, LocalDate.now());
    }

    public Booking confirmBooking(Long id) {
        return updateBookingStatus(id, BookingStatus.CONFIRMED);
    }

    public Booking cancelBooking(Long id) {
        return updateBookingStatus(id, BookingStatus.CANCELLED);
    }

    public Booking rejectBooking(Long id) {
        return updateBookingStatus(id, BookingStatus.REJECTED);
    }
}