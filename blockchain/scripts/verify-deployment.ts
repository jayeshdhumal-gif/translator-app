import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {

    // Addresses from our deployment
    const tokenAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const paymentAddress =
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


    // Get the deployer account
    const [deployer] = await ethers.getSigners();

    console.log("=================================");
    console.log("DEPLOYMENT VERIFICATION");
    console.log("=================================");

    console.log(
        "Deployer:",
        deployer.address
    );


    // --------------------------------
    // 1. Check TranslatorToken
    // --------------------------------

    const token = await ethers.getContractAt(
        "TranslatorToken",
        tokenAddress
    );

    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const deployerBalance = await token.balanceOf(
        deployer.address
    );

    console.log("\n--- TranslatorToken ---");

    console.log("Address:", tokenAddress);
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);

    console.log(
        "Total Supply:",
        ethers.formatUnits(totalSupply, decimals),
        symbol
    );

    console.log(
        "Deployer Balance:",
        ethers.formatUnits(deployerBalance, decimals),
        symbol
    );


    // --------------------------------
    // 2. Check BookingPayment
    // --------------------------------

    const payment = await ethers.getContractAt(
        "BookingPayment",
        paymentAddress
    );

    const connectedTokenAddress =
        await payment.token();

    console.log("\n--- BookingPayment ---");

    console.log(
        "Address:",
        paymentAddress
    );

    console.log(
        "Token Address:",
        connectedTokenAddress
    );


    // --------------------------------
    // 3. Verify addresses match
    // --------------------------------

    console.log("\n--- Verification ---");

    if (
        connectedTokenAddress.toLowerCase() ===
        tokenAddress.toLowerCase()
    ) {
        console.log(
            "SUCCESS: BookingPayment is connected to TranslatorToken."
        );
    } else {
        console.log(
            "ERROR: BookingPayment is connected to the wrong token."
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});