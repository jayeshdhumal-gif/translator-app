import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deployer address:", deployer.address);

    const balance = await ethers.provider.getBalance(
        deployer.address
    );

    console.log(
        "Deployer balance:",
        ethers.formatEther(balance),
        "ETH"
    );


    // 1. Deploy TranslatorToken

    const Token = await ethers.getContractFactory(
        "TranslatorToken"
    );

    const initialSupply = 1_000_000;

    const token = await Token.deploy(initialSupply);

    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();

    console.log(
        "TranslatorToken deployed to:",
        tokenAddress
    );


    // 2. Deploy BookingPayment

    const Payment = await ethers.getContractFactory(
        "BookingPayment"
    );

    const payment = await Payment.deploy(
        tokenAddress
    );

    await payment.waitForDeployment();

    const paymentAddress = await payment.getAddress();

    console.log(
        "BookingPayment deployed to:",
        paymentAddress
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});