package com.translatorapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.translatorapp.booking.Booking;
import com.translatorapp.booking.BookingRequest;
import com.translatorapp.booking.BookingStatus;
import com.translatorapp.profile.TranslatorProfile;
import com.translatorapp.profile.User;
import com.translatorapp.repository.BookingRepository;
import com.translatorapp.repository.TranslatorProfileRepository;
import com.translatorapp.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TranslatorProfileRepository translatorProfileRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            TranslatorProfileRepository translatorProfileRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.translatorProfileRepository = translatorProfileRepository;
    }

    @Transactional
    public Booking createBooking(String userEmail, BookingRequest request) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find translator
        TranslatorProfile translator = translatorProfileRepository
                .findById(request.getTranslatorId())
                .orElseThrow(() -> new RuntimeException("Translator not found"));

        // 3. Basic validation
        if (request.getBookingDate() == null) {
            throw new RuntimeException("Booking date is required");
        }

        if (request.getStartTime() == null) {
            throw new RuntimeException("Start time is required");
        }

        if (request.getDurationHours() == null ||
                request.getDurationHours() <= 0) {

            throw new RuntimeException("Duration must be greater than 0 hours");
        }

        // 4. Don't allow booking in the past
        LocalDateTime bookingStart =
                LocalDateTime.of(
                        request.getBookingDate(),
                        request.getStartTime()
                );

        if (bookingStart.isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "You cannot create a booking in the past"
            );
        }

        // 5. Get translator's hourly rate
        BigDecimal hourlyRate = translator.getHourlyRate();

        if (hourlyRate == null) {
            throw new RuntimeException(
                    "Translator hourly rate is not available"
            );
        }

        // 6. Calculate total amount
        BigDecimal totalAmount = hourlyRate.multiply(
                BigDecimal.valueOf(request.getDurationHours())
        );

        // 7. Calculate requested end time
        LocalTime requestedEndTime =
                request.getStartTime()
                        .plusHours(request.getDurationHours());

        // 8. Check existing bookings for this translator
        List<Booking> existingBookings =
                bookingRepository.findByTranslatorIdAndBookingDate(
                        request.getTranslatorId(),
                        request.getBookingDate()
                );

        // 9. Check for time overlap
        for (Booking existingBooking : existingBookings) {

            // Ignore rejected and cancelled bookings
            if (existingBooking.getStatus() == BookingStatus.REJECTED ||
                    existingBooking.getStatus() == BookingStatus.CANCELLED) {

                continue;
            }

            LocalTime existingStart =
                    existingBooking.getStartTime();

            LocalTime existingEnd =
                    existingStart.plusHours(
                            existingBooking.getDurationHours()
                    );

            boolean overlaps =
                    request.getStartTime().isBefore(existingEnd)
                    &&
                    requestedEndTime.isAfter(existingStart);

            if (overlaps) {
                throw new RuntimeException(
                        "Translator is already booked during this time"
                );
            }
        }

        // 10. Create booking
        Booking booking = new Booking();

        booking.setUser(user);
        booking.setTranslator(translator);

        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setDurationHours(request.getDurationHours());

        booking.setHourlyRate(hourlyRate);
        booking.setTotalAmount(totalAmount);

        // 11. New booking starts as PENDING
        booking.setStatus(BookingStatus.PENDING);

        // 12. Save booking
        return bookingRepository.save(booking);
    }
}