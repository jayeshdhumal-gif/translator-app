package com.translatorapp.service;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.utils.Convert;

@Service
public class BlockchainService {

    private final Web3j web3j;

    @Value("${blockchain.deployer-address}")
    private String deployerAddress;

    public BlockchainService(Web3j web3j) {
        this.web3j = web3j;
    }

    public String getBlockchainInfo() throws Exception {

        // Get latest block number
        BigInteger blockNumber = web3j.ethBlockNumber()
                .send()
                .getBlockNumber();

        // Get ETH balance of deployer
        EthGetBalance balanceResponse = web3j.ethGetBalance(
                deployerAddress,
                org.web3j.protocol.core.DefaultBlockParameterName.LATEST
        ).send();

        BigInteger balanceWei = balanceResponse.getBalance();

        String balanceEth = Convert.fromWei(
                balanceWei.toString(),
                Convert.Unit.ETHER
        ).toString();

        return "Block Number: " + blockNumber
                + ", Deployer: " + deployerAddress
                + ", ETH Balance: " + balanceEth;
    }
}