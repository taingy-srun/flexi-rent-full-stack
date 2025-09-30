package com.roomrental.bookingservice.controller;

import com.roomrental.bookingservice.dto.BookingCreateRequest;
import com.roomrental.bookingservice.model.Booking;
import com.roomrental.bookingservice.model.BookingStatus;
import com.roomrental.bookingservice.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Booking>> getBookingsByTenant(@PathVariable Long tenantId) {
        List<Booking> bookings = bookingService.getBookingsByTenant(tenantId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<Booking>> getBookingsByLandlord(@PathVariable Long landlordId) {
        List<Booking> bookings = bookingService.getBookingsByLandlord(landlordId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Booking>> getBookingsByProperty(@PathVariable Long propertyId) {
        List<Booking> bookings = bookingService.getBookingsByProperty(propertyId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/property/{propertyId}/availability")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable Long propertyId,
                                                    @RequestParam LocalDate startDate,
                                                    @RequestParam LocalDate endDate) {
        boolean available = bookingService.isPropertyAvailable(propertyId, startDate, endDate);
        return ResponseEntity.ok(available);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id,
                                                      @RequestParam BookingStatus status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
        Booking booking = bookingService.confirmBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable Long id) {
        Booking booking = bookingService.rejectBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }
}