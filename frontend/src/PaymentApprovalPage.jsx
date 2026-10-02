import { useState } from 'react';
import { ethers } from 'ethers';
import { createPaymentApproval } from './api.js';
import './PaymentApprovalPage.css';

const TOKEN_ADDRESS =
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const PAYMENT_CONTRACT_ADDRESS =
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const TOKEN_ABI = [
    'function approve(address spender, uint256 amount) returns (bool)'
];

export default function PaymentApprovalPage({
    booking,
    translator,
    totalAmount,
    onBack
}) {

    const [walletAddress, setWalletAddress] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [message, setMessage] = useState('');
    const [transactionHash, setTransactionHash] = useState('');

    async function handleApprovePayment() {

        setMessage('');
        setTransactionHash('');

        // -----------------------------------------
        // 1. Validate wallet address
        // -----------------------------------------

        if (!walletAddress.trim()) {

            setMessage(
                'Please enter your wallet address.'
            );

            return;
        }

        if (!ethers.isAddress(walletAddress.trim())) {

            setMessage(
                'Please enter a valid Ethereum wallet address.'
            );

            return;
        }

        try {

            setIsApproving(true);

            // -----------------------------------------
            // 2. Check MetaMask
            // -----------------------------------------

            if (!window.ethereum) {

                throw new Error(
                    'MetaMask is not installed. Please install MetaMask.'
                );
            }

            // -----------------------------------------
            // 3. Ask MetaMask to connect
            // -----------------------------------------

            const accounts =
                await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

            if (!accounts || accounts.length === 0) {

                throw new Error(
                    'No MetaMask account was selected.'
                );
            }

            const metamaskAddress = accounts[0];

            console.log(
                'Entered address:',
                walletAddress
            );

            console.log(
                'MetaMask address:',
                metamaskAddress
            );

            // -----------------------------------------
            // 4. Compare entered address
            //    with MetaMask address
            // -----------------------------------------

            if (
                metamaskAddress.toLowerCase() !==
                walletAddress.trim().toLowerCase()
            ) {

                throw new Error(
                    'The selected MetaMask account does not match the wallet address entered.'
                );
            }

            // -----------------------------------------
            // 5. Create ethers provider
            // -----------------------------------------

            const provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );

            // -----------------------------------------
            // 6. Get MetaMask signer
            // -----------------------------------------

            const signer =
                await provider.getSigner();

            // -----------------------------------------
            // 7. Create token contract
            // -----------------------------------------

            const tokenContract =
                new ethers.Contract(
                    TOKEN_ADDRESS,
                    TOKEN_ABI,
                    signer
                );

            // -----------------------------------------
            // 8. Convert amount to 18 decimals
            // -----------------------------------------

            const amountInWei =
                ethers.parseUnits(
                    totalAmount.toString(),
                    18
                );

            // -----------------------------------------
            // 9. Ask MetaMask to approve
            // -----------------------------------------

            setMessage(
                'Please confirm the transaction in MetaMask...'
            );

            const transaction =
                await tokenContract.approve(
                    PAYMENT_CONTRACT_ADDRESS,
                    amountInWei
                );

            console.log(
                'Approval transaction:',
                transaction.hash
            );

            setTransactionHash(
                transaction.hash
            );

            setMessage(
                'Transaction submitted. Waiting for confirmation...'
            );

            // -----------------------------------------
            // 10. Wait for blockchain confirmation
            // -----------------------------------------

            const receipt =
                await transaction.wait();

            console.log(
                'Approval confirmed:',
                receipt
            );

            // -----------------------------------------
            // 11. Send approval to backend
            // -----------------------------------------

            await createPaymentApproval({

                bookingId: booking.id,

                walletAddress:
                    walletAddress.trim(),

                tokenAddress:
                    TOKEN_ADDRESS,

                spenderAddress:
                    PAYMENT_CONTRACT_ADDRESS,

                amount:
                    totalAmount,

                transactionHash:
                    transaction.hash,

                chainId:
                    31337
            });

            // -----------------------------------------
            // 12. Success
            // -----------------------------------------

            setMessage(
                'Payment approved successfully!'
            );

        } catch (error) {

            console.error(
                'Payment approval error:',
                error
            );

            if (
                error.code === 'ACTION_REJECTED' ||
                error.code === 4001
            ) {

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

        <section className="payment-approval-page">

            <div className="payment-approval-container">

                {/* Back */}

                <button
                    type="button"
                    className="payment-back-button"
                    onClick={onBack}
                    disabled={isApproving}
                >
                    ← Back
                </button>


                {/* Header */}

                <div className="payment-approval-header">

                    <span>
                        PAYMENT
                    </span>

                    <h2>
                        Approve Payment
                    </h2>

                    <p>
                        Enter the wallet address you want to use
                        for this payment.
                    </p>

                </div>


                {/* Booking information */}

                <div className="payment-booking-card">

                    <div>

                        <span>
                            Translator
                        </span>

                        <strong>
                            {translator?.name || 'Translator'}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Booking ID
                        </span>

                        <strong>
                            #{booking?.id}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Amount
                        </span>

                        <strong>
                            {totalAmount} NISK
                        </strong>

                    </div>

                </div>


                {/* Wallet form */}

                <div className="payment-form">

                    <label>

                        Wallet Address

                        <input
                            type="text"
                            placeholder="0x..."
                            value={walletAddress}
                            onChange={(event) =>
                                setWalletAddress(
                                    event.target.value
                                )
                            }
                            disabled={isApproving}
                        />

                    </label>


                    <div className="payment-contract-info">

                        <span>
                            Payment Contract
                        </span>

                        <small>
                            {PAYMENT_CONTRACT_ADDRESS}
                        </small>

                    </div>


                    {/* Message */}

                    {message && (

                        <p
                            className={`payment-message ${
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


                    {/* Transaction hash */}

                    {transactionHash && (

                        <div className="transaction-hash">

                            <span>
                                Transaction Hash
                            </span>

                            <small>
                                {transactionHash}
                            </small>

                        </div>

                    )}


                    {/* Approve button */}

                    <button
                        type="button"
                        onClick={handleApprovePayment}
                        disabled={isApproving}
                    >

                        {isApproving
                            ? 'Approving...'
                            : 'Approve Payment'}

                    </button>

                </div>

            </div>

        </section>
    );
}