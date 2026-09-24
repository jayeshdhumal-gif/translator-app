package com.translatorapp.controller;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.translatorapp.service.BlockchainService;
import com.translatorapp.service.BookingPaymentService;
import com.translatorapp.service.TranslatorTokenService;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    private final BlockchainService blockchainService;
    private final TranslatorTokenService translatorTokenService;
    private final BookingPaymentService bookingPaymentService;

    public BlockchainController(
            BlockchainService blockchainService,
            TranslatorTokenService translatorTokenService,
            BookingPaymentService bookingPaymentService) {

        this.blockchainService = blockchainService;
        this.translatorTokenService = translatorTokenService;
        this.bookingPaymentService = bookingPaymentService;
    }

    // ==========================
    // General Blockchain
    // ==========================

    @GetMapping("/info")
    public String getBlockchainInfo() throws Exception {
        return blockchainService.getBlockchainInfo();
    }

    // ==========================
    // Translator Token
    // ==========================

    @GetMapping("/token")
    public Map<String, String> getTokenInfo() throws Exception {

        Map<String, String> response = new HashMap<>();

        response.put(
                "name",
                translatorTokenService.getName()
        );

        response.put(
                "symbol",
                translatorTokenService.getSymbol()
        );

        return response;
    }

    @GetMapping("/token/total-supply")
    public BigInteger getTotalSupply() throws Exception {

        return translatorTokenService.getTotalSupply();
    }

    @GetMapping("/token/balance")
    public BigInteger getTokenBalance(
            @RequestParam String address) throws Exception {

        return translatorTokenService.getBalance(address);
    }

    // ==========================
    // Booking Payment
    // ==========================

    @GetMapping("/payment/token")
    public String getPaymentTokenAddress() throws Exception {

        return bookingPaymentService.getTokenAddress();
    }
}