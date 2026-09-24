package com.translatorapp.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

@Configuration
public class BlockConfig {

    @Value("${blockchain.rpc-url}")
    private String rpcUrl;

    @Bean
    public Web3j web3j() {
        return Web3j.build(
                new HttpService(rpcUrl)
        );
    }
}