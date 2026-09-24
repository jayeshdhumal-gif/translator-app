package com.translatorapp.wrapper;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/LFDT-web3j/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 4.14.0.
 */
@SuppressWarnings("rawtypes")
public class BookingPayment extends Contract {
    public static final String BINARY = "Bin file was not provided";

    public static final String FUNC_PAYTRANSLATOR = "payTranslator";

    public static final String FUNC_TOKEN = "token";

    public static final Event PAYMENTMADE_EVENT = new Event("PaymentMade", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Uint256>() {}));
    ;

    @Deprecated
    protected BookingPayment(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected BookingPayment(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected BookingPayment(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected BookingPayment(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<PaymentMadeEventResponse> getPaymentMadeEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(PAYMENTMADE_EVENT, transactionReceipt);
        ArrayList<PaymentMadeEventResponse> responses = new ArrayList<PaymentMadeEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            PaymentMadeEventResponse typedResponse = new PaymentMadeEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.bookingId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.user = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.translator = (String) eventValues.getIndexedValues().get(2).getValue();
            typedResponse.amount = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static PaymentMadeEventResponse getPaymentMadeEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(PAYMENTMADE_EVENT, log);
        PaymentMadeEventResponse typedResponse = new PaymentMadeEventResponse();
        typedResponse.log = log;
        typedResponse.bookingId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.user = (String) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.translator = (String) eventValues.getIndexedValues().get(2).getValue();
        typedResponse.amount = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<PaymentMadeEventResponse> paymentMadeEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getPaymentMadeEventFromLog(log));
    }

    public Flowable<PaymentMadeEventResponse> paymentMadeEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(PAYMENTMADE_EVENT));
        return paymentMadeEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> payTranslator(BigInteger bookingId,
            String translator, BigInteger amount) {
        final Function function = new Function(
                FUNC_PAYTRANSLATOR, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(bookingId), 
                new org.web3j.abi.datatypes.Address(160, translator), 
                new org.web3j.abi.datatypes.generated.Uint256(amount)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> token() {
        final Function function = new Function(FUNC_TOKEN, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    @Deprecated
    public static BookingPayment load(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return new BookingPayment(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static BookingPayment load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new BookingPayment(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static BookingPayment load(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return new BookingPayment(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static BookingPayment load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new BookingPayment(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static class PaymentMadeEventResponse extends BaseEventResponse {
        public BigInteger bookingId;

        public String user;

        public String translator;

        public BigInteger amount;
    }
}
