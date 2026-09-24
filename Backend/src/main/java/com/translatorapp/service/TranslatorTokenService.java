package com.translatorapp.service;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.tx.ReadonlyTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import com.translatorapp.wrapper.TranslatorToken;

@Service
public class TranslatorTokenService {

    private final TranslatorToken translatorToken;

    public TranslatorTokenService(
            Web3j web3j,
            @Value("${blockchain.token-address}") String tokenAddress) {

        TransactionManager transactionManager =
                new ReadonlyTransactionManager(web3j, tokenAddress);

        ContractGasProvider gasProvider =
                new StaticGasProvider(
                        BigInteger.valueOf(2_000_000_000L),
                        BigInteger.valueOf(1_000_000)
                );

        this.translatorToken = TranslatorToken.load(
                tokenAddress,
                web3j,
                transactionManager,
                gasProvider
        );
    }

    public String getName() throws Exception {
        return translatorToken.name().send();
    }

    public String getSymbol() throws Exception {
        return translatorToken.symbol().send();
    }

    public BigInteger getTotalSupply() throws Exception {
        return translatorToken.totalSupply().send();
    }

    public BigInteger getBalance(String address) throws Exception {
        return translatorToken.balanceOf(address).send();
    }
}