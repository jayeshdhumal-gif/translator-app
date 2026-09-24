package com.translatorapp.service;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.tx.ReadonlyTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import com.translatorapp.wrapper.BookingPayment;

@Service
public class BookingPaymentService {

    private final BookingPayment bookingPayment;

    public BookingPaymentService(
            Web3j web3j,
            @Value("${blockchain.payment-contract-address}") String paymentContractAddress) {

        // Read-only connection to BookingPayment contract
        TransactionManager transactionManager =
                new ReadonlyTransactionManager(
                        web3j,
                        paymentContractAddress
                );

        // Required by the generated Web3j wrapper
        ContractGasProvider gasProvider =
                new StaticGasProvider(
                        BigInteger.valueOf(2_000_000_000L),
                        BigInteger.valueOf(1_000_000)
                );

        // Load already deployed BookingPayment contract
        this.bookingPayment = BookingPayment.load(
                paymentContractAddress,
                web3j,
                transactionManager,
                gasProvider
        );
    }

    public String getTokenAddress() throws Exception {
        return bookingPayment.token().send();
    }
}