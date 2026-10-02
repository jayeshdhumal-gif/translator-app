import { useState } from 'react';
import { createBooking } from './api.js';
import './BookingPage.css';

export default function BookingPage({ translator, onBack, onPaymentApproval }) {

    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [durationHours, setDurationHours] = useState(1);

    const [isBooking, setIsBooking] = useState(false);

    const [booking, setBooking] = useState(null);

    const [message, setMessage] = useState('');

    const totalAmount =
        Number(translator.hourlyRate || 0) *
        Number(durationHours);


    const translatorInitials = (translator.name || 'Translator')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();


    async function handleBooking() {

        setMessage('');

        // -----------------------------------------
        // 1. Validate booking date
        // -----------------------------------------

        if (!bookingDate) {

            setMessage(
                'Please select a booking date.'
            );

            return;
        }


        // -----------------------------------------
        // 2. Validate start time
        // -----------------------------------------

        if (!startTime) {

            setMessage(
                'Please select a start time.'
            );

            return;
        }


        try {

            setIsBooking(true);


            // -----------------------------------------
            // 3. Create booking request
            // -----------------------------------------

            const bookingData = {

                translatorId:
                    translator.id,

                bookingDate:
                    bookingDate,

                startTime:
                    startTime,

                durationHours:
                    Number(durationHours)
            };


            // -----------------------------------------
            // 4. Send booking to Spring Boot
            // -----------------------------------------

            const response =
                await createBooking(bookingData);


            console.log(
                'Booking created:',
                response
            );


            // -----------------------------------------
            // 5. Save booking
            // -----------------------------------------

            setBooking(response);


            setMessage(
                'Booking created successfully!'
            );


        } catch (error) {

            console.error(
                'Booking error:',
                error
            );


            setMessage(
                error.message ||
                'Unable to create booking.'
            );


        } finally {

            setIsBooking(false);

        }
    }


    // -----------------------------------------
    // After booking is created
    // -----------------------------------------

    function handleContinueToPayment() {

        if (!booking) {
            return;
        }


        /*
         * Send the booking information to the
         * payment approval page.
         */

        if (onPaymentApproval) {

            onPaymentApproval({

                booking: booking,

                translator: translator,

                totalAmount: totalAmount

            });

        }

    }


    return (

        <section className="booking-page">


            {/* -----------------------------------------
                Back button
            ----------------------------------------- */}

            <button
                type="button"
                className="booking-back-button"
                onClick={onBack}
            >
                ← Back to translators
            </button>


            <div className="booking-container">


                {/* -----------------------------------------
                    Header
                ----------------------------------------- */}

                <div className="booking-header">

                    <span className="booking-label">
                        BOOKING REQUEST
                    </span>


                    <h2>
                        Book Translator
                    </h2>


                    <p>
                        Choose your preferred date, time and
                        duration for the translation session.
                    </p>

                </div>


                {/* -----------------------------------------
                    Translator summary
                ----------------------------------------- */}

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


                {/* -----------------------------------------
                    Booking form
                ----------------------------------------- */}

                {!booking && (

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
                                    setBookingDate(
                                        event.target.value
                                    )
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
                                    setStartTime(
                                        event.target.value
                                    )
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


                        {/* Error / success */}

                        {message && (

                            <p
                                className={`booking-message ${
                                    message.includes(
                                        'successfully'
                                    )
                                        ? 'success'
                                        : 'error'
                                }`}
                            >
                                {message}
                            </p>

                        )}


                        {/* Create booking */}

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

                )}


                {/* -----------------------------------------
                    Booking successfully created
                ----------------------------------------- */}

                {booking && (

                    <div className="booking-form">


                        <div className="booking-success-card">

                            <div className="booking-success-icon">
                                ✓
                            </div>


                            <h3>
                                Booking Created Successfully
                            </h3>


                            <p>
                                Your booking has been created.
                                The next step is to approve the
                                payment from your MetaMask wallet.
                            </p>


                            <div className="booking-confirmation-info">

                                <div>

                                    <span>
                                        Booking ID
                                    </span>

                                    <strong>
                                        #{booking.id}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Translator
                                    </span>

                                    <strong>
                                        {translator.name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {durationHours} hour
                                        {durationHours > 1 ? 's' : ''}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹{totalAmount}
                                    </strong>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleContinueToPayment
                                }
                            >
                                Continue to Payment
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}