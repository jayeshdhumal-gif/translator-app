package com.translatorapp.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {

    private Long translatorId;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private Integer durationHours;

    public Long getTranslatorId() {
        return translatorId;
    }

    public void setTranslatorId(Long translatorId) {
        this.translatorId = translatorId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Integer getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }
}