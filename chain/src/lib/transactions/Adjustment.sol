// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Issuer, StockClass } from "../Structs.sol";
import "../TxHelper.sol";
import "../../transactions/IssuerAuthorizedSharesAdjustmentTX.sol";
import "../../transactions/StockClassAuthorizedSharesAdjustmentTX.sol";

library Adjustment {
    // combine both
    // 1. Issuer authorized shares adjustment
    // 2. Stock Class authorized shares adjustment

    event IssuerAuthorizedSharesAdjusted(IssuerAuthorizedSharesAdjustment adjustment);

    event StockClassAuthorizedSharesAdjusted(StockClassAuthorizedSharesAdjustment adjustment);

    function adjustIssuerAuthorizedShares(
        uint256 nonce,
        uint256 newSharesAuthorized,
        string[] memory comments,
        string memory boardApprovalDate,
        string memory stockholderApprovalDate,
        Issuer storage issuer,
        address[] storage transactions
    ) external {
        uint256 newShares = newSharesAuthorized + issuer.shares_authorized;
        issuer.shares_authorized = newShares;

        nonce++;
        IssuerAuthorizedSharesAdjustment memory adjustment = TxHelper.adjustIssuerAuthorizedShares(
            nonce,
            newSharesAuthorized,
            comments,
            boardApprovalDate,
            stockholderApprovalDate,
            issuer.id
        );

        IssuerAuthorizedSharesAdjustmentTx issuerAuthorizedSharesAdjustmentTx = new IssuerAuthorizedSharesAdjustmentTx(adjustment);
        transactions.push(address(issuerAuthorizedSharesAdjustmentTx));
        emit IssuerAuthorizedSharesAdjusted(adjustment);
    }

    // do the above for stock class
    function adjustStockClassAuthorizedShares(
        uint256 nonce,
        uint256 newSharesAuthorized,
        string[] memory comments,
        string memory boardApprovalDate,
        string memory stockholderApprovalDate,
        StockClass storage stockClass,
        address[] storage transactions
    ) external {
        uint256 newShares = newSharesAuthorized + stockClass.shares_authorized;
        stockClass.shares_authorized = newShares;

        nonce++;
        StockClassAuthorizedSharesAdjustment memory adjustment = TxHelper.adjustStockClassAuthorizedShares(
            nonce,
            newSharesAuthorized,
            comments,
            boardApprovalDate,
            stockholderApprovalDate,
            stockClass.id
        );

        StockClassAuthorizedSharesAdjustmentTx stockClassAuthorizedSharesAdjustmentTx = new StockClassAuthorizedSharesAdjustmentTx(adjustment);
        transactions.push(address(stockClassAuthorizedSharesAdjustmentTx));
        emit StockClassAuthorizedSharesAdjusted(adjustment);
    }
}
