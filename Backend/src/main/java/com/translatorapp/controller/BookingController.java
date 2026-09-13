package com.translatorapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.translatorapp.booking.Booking;
import com.translatorapp.booking.BookingRequest;
import com.translatorapp.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {
        System.out.println("Authentication data " + authentication);

        // Get email of currently logged-in user
        String userEmail = authentication.getName();

        // Create booking
        Booking booking = bookingService.createBooking(
                userEmail,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }
}