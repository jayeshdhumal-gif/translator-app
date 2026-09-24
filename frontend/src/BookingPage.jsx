import { useState } from 'react';
import { ethers } from 'ethers';
import { createBooking, createPaymentApproval } from './api.js';
import './BookingPage.css';

const TOKEN_ADDRESS =
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const PAYMENT_CONTRACT_ADDRESS =
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const TOKEN_ABI = [
    'function approve(address spender, uint256 amount) returns (bool)'
];

export default function BookingPage({ translator, onBack }) {

    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [durationHours, setDurationHours] = useState(1);

    const [isBooking, setIsBooking] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

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

            const bookingData = {
                translatorId: translator.id,
                bookingDate: bookingDate,
                startTime: startTime,
                durationHours: Number(durationHours)
            };

            const response = await createBooking(bookingData);

            console.log('Booking created:', response);

            /*
             * Save the booking returned by Spring Boot.
             *
             * We need the booking ID later when saving
             * the payment approval.
             */
            setBooking(response);

            setMessage(
                'Booking created successfully! Please approve the payment.'
            );

        } catch (error) {

            console.error(error);

            setMessage(
                error.message || 'Unable to create booking.'
            );

        } finally {

            setIsBooking(false);
        }
    }


    async function handleApprovePayment() {

        setMessage('');

        try {

            setIsApproving(true);

            // -----------------------------------------
            // 1. Check MetaMask
            // -----------------------------------------

            if (!window.ethereum) {

                throw new Error(
                    'MetaMask is not installed. Please install MetaMask.'
                );
            }


            // -----------------------------------------
            // 2. Ask MetaMask for the user's wallet
            // -----------------------------------------

            const accounts =
                await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

            const walletAddress = accounts[0];

            console.log(
                'Connected wallet:',
                walletAddress
            );


            // -----------------------------------------
            // 3. Create ethers provider
            // -----------------------------------------

            const provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            // -----------------------------------------
            // 4. Get user's MetaMask signer
            // -----------------------------------------

            const signer =
                await provider.getSigner();


            // -----------------------------------------
            // 5. Create TranslatorToken contract
            // -----------------------------------------

            const tokenContract =
                new ethers.Contract(
                    TOKEN_ADDRESS,
                    TOKEN_ABI,
                    signer
                );


            // -----------------------------------------
            // 6. Convert NISK amount to blockchain units
            // -----------------------------------------

            const amountInWei =
                ethers.parseUnits(
                    totalAmount.toString(),
                    18
                );


            console.log(
                'Approving amount:',
                amountInWei.toString()
            );


            // -----------------------------------------
            // 7. Call approve()
            // -----------------------------------------

            const transaction =
                await tokenContract.approve(
                    PAYMENT_CONTRACT_ADDRESS,
                    amountInWei
                );


            console.log(
                'Approval transaction:',
                transaction.hash
            );


            setMessage(
                'Approval transaction submitted. Waiting for confirmation...'
            );


            // -----------------------------------------
            // 8. Wait for blockchain confirmation
            // -----------------------------------------

            const receipt =
                await transaction.wait();


            console.log(
                'Approval confirmed:',
                receipt
            );


            // -----------------------------------------
            // 9. Send transaction information
            //    to Spring Boot
            // -----------------------------------------

            await createPaymentApproval({

                bookingId: booking.id,

                walletAddress: walletAddress,

                tokenAddress: TOKEN_ADDRESS,

                spenderAddress:
                    PAYMENT_CONTRACT_ADDRESS,

                amount: totalAmount,

                transactionHash:
                    transaction.hash,

                chainId: 31337
            });


            // -----------------------------------------
            // 10. Success
            // -----------------------------------------

            setMessage(
                'Payment approved successfully!'
            );


        } catch (error) {

            console.error(
                'Payment approval error:',
                error
            );

            if (error.code === 'ACTION_REJECTED') {

                setMessage(
                    'Transaction was rejected in MetaMask.'
                );

            } else {

                setMessage(
                    error.message ||
                    'Unable to approve payment.'
                );
            }

        } finally {

            setIsApproving(false);
        }
    }


    return (
        <section className="booking-page">

            <button
                type="button"
                className="booking-back-button"
                onClick={onBack}
            >
                ← Back to translators
            </button>


            <div className="booking-container">

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


                <div className="booking-form">

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


                    <div className="booking-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{totalAmount}
                        </strong>

                    </div>


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


                    {/* --------------------------------
                        STEP 1:
                        Create booking
                    -------------------------------- */}

                    {!booking && (

                        <button
                            type="button"
                            onClick={handleBooking}
                            disabled={isBooking}
                        >
                            {isBooking
                                ? 'Booking...'
                                : 'Confirm Booking'}
                        </button>

                    )}


                    {/* --------------------------------
                        STEP 2:
                        Approve payment
                    -------------------------------- */}

                    {booking && (

                        <button
                            type="button"
                            onClick={handleApprovePayment}
                            disabled={isApproving}
                        >
                            {isApproving
                                ? 'Approving Payment...'
                                : 'Approve Payment'}
                        </button>

                    )}

                </div>

            </div>

        </section>
    );
}