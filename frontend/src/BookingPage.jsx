import { useState } from 'react';
import { createBooking } from './api.js';
import './BookingPage.css';

export default function BookingPage({ translator, onBack }) {

    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [durationHours, setDurationHours] = useState(1);

    const [isBooking, setIsBooking] = useState(false);
    const [message, setMessage] = useState('');

    const totalAmount =
        Number(translator.hourlyRate || 0) * Number(durationHours);

    const translatorInitials = (translator.name || 'Translator')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    async function handleBooking() {

        setMessage('');

        if (!bookingDate) {
            setMessage('Please select a booking date.');
            return;
        }

        if (!startTime) {
            setMessage('Please select a start time.');
            return;
        }

        try {

            setIsBooking(true);

            const booking = {
                translatorId: translator.id,
                bookingDate: bookingDate,
                startTime: startTime,
                durationHours: Number(durationHours)
            };

            const response = await createBooking(booking);

            console.log('Booking created:', response);

            setMessage('Booking created successfully!');

        } catch (error) {

            setMessage(
                error.message || 'Unable to create booking.'
            );

        } finally {

            setIsBooking(false);

        }
    }

    return (
        <section className="booking-page">

            {/* Back button */}
            <button
                type="button"
                className="booking-back-button"
                onClick={onBack}
            >
                ← Back to translators
            </button>


            <div className="booking-container">

                {/* Header */}
                <div className="booking-header">

                    <span className="booking-label">
                        BOOKING REQUEST
                    </span>

                    <h2>
                        Book Translator
                    </h2>

                    <p>
                        Choose your preferred date, time and duration
                        for the translation session.
                    </p>

                </div>


                {/* Translator summary */}
                <div className="translator-summary">

                    <div className="booking-translator-avatar">
                        {translatorInitials || 'T'}
                    </div>

                    <div className="translator-summary-info">

                        <h3>
                            {translator.name || 'Translator'}
                        </h3>

                        <p>
                            📍 {translator.city || 'Location not provided'}
                        </p>

                    </div>

                    <div className="translator-summary-rate">

                        <strong>
                            ₹{translator.hourlyRate || 0}
                        </strong>

                        <span>
                            / hour
                        </span>

                    </div>

                </div>


                {/* Booking form */}
                <div className="booking-form">

                    {/* Date */}
                    <label>
                        Booking Date

                        <input
                            type="date"
                            min={
                                new Date()
                                    .toISOString()
                                    .split('T')[0]
                            }
                            value={bookingDate}
                            onChange={(event) =>
                                setBookingDate(event.target.value)
                            }
                        />

                    </label>


                    {/* Time */}
                    <label>
                        Start Time

                        <input
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                                setStartTime(event.target.value)
                            }
                        />

                    </label>


                    {/* Duration */}
                    <label>
                        Duration

                        <select
                            value={durationHours}
                            onChange={(event) =>
                                setDurationHours(
                                    Number(event.target.value)
                                )
                            }
                        >

                            <option value="1">
                                1 hour
                            </option>

                            <option value="2">
                                2 hours
                            </option>

                            <option value="3">
                                3 hours
                            </option>

                            <option value="4">
                                4 hours
                            </option>

                            <option value="5">
                                5 hours
                            </option>

                            <option value="6">
                                6 hours
                            </option>

                            <option value="7">
                                7 hours
                            </option>

                            <option value="8">
                                8 hours
                            </option>

                        </select>

                    </label>


                    {/* Total */}
                    <div className="booking-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{totalAmount}
                        </strong>

                    </div>


                    {/* Success / error message */}
                    {message && (
                        <p
                            className={`booking-message ${message.includes('successfully')
                                    ? 'success'
                                    : 'error'
                                }`}
                        >
                            {message}
                        </p>
                    )}


                    {/* Confirm booking */}
                    <button
                        type="button"
                        onClick={handleBooking}
                        disabled={isBooking}
                    >
                        {isBooking
                            ? 'Booking...'
                            : 'Confirm Booking'}
                    </button>

                </div>

            </div>

        </section>
    );
}