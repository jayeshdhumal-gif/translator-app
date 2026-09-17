// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BookingPayment {

    IERC20 public token;

    event PaymentMade(
        uint256 indexed bookingId,
        address indexed user,
        address indexed translator,
        uint256 amount
    );

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function payTranslator(
        uint256 bookingId,
        address translator,
        uint256 amount
    ) external {

        require(amount > 0, "Amount must be greater than zero");

        require(
            token.transferFrom(
                msg.sender,
                translator,
                amount
            ),
            "Payment failed"
        );

        emit PaymentMade(
            bookingId,
            msg.sender,
            translator,
            amount
        );
    }
}