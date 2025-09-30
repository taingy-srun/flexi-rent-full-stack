package com.roomrental.bookingservice.repository;

import com.roomrental.bookingservice.model.Booking;
import com.roomrental.bookingservice.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTenantId(Long tenantId);

    List<Booking> findByLandlordId(Long landlordId);

    List<Booking> findByPropertyId(Long propertyId);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.propertyId = :propertyId AND " +
           "b.status IN ('CONFIRMED', 'PENDING') AND " +
           "((b.startDate <= :endDate AND b.endDate >= :startDate))")
    List<Booking> findConflictingBookings(@Param("propertyId") Long propertyId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.propertyId = :propertyId AND " +
           "b.status = 'CONFIRMED' AND " +
           "b.endDate >= :currentDate")
    List<Booking> findActiveBookingsForProperty(@Param("propertyId") Long propertyId,
                                              @Param("currentDate") LocalDate currentDate);
}