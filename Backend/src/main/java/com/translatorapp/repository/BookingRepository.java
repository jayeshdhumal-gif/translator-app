package com.translatorapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.translatorapp.booking.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTranslatorIdAndBookingDate(
            Long translatorId,
            LocalDate bookingDate
    );
}