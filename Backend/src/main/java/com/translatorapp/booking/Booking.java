package com.translatorapp.booking;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.translatorapp.profile.TranslatorProfile;
import com.translatorapp.profile.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private TranslatorProfile translator;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private Integer durationHours;

    private BigDecimal hourlyRate;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public User getUser() {
    return user;
}

public void setUser(User user) {
    this.user = user;
}

public TranslatorProfile getTranslator() {
    return translator;
}

public void setTranslator(TranslatorProfile translator) {
    this.translator = translator;
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

public BigDecimal getHourlyRate() {
    return hourlyRate;
}

public void setHourlyRate(BigDecimal hourlyRate) {
    this.hourlyRate = hourlyRate;
}

public BigDecimal getTotalAmount() {
    return totalAmount;
}

public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
}

public BookingStatus getStatus() {
    return status;
}

public void setStatus(BookingStatus status) {
    this.status = status;
}

}