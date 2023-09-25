// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ActivePosition, StockIssuance, StockTransfer } from "./Structs.sol";
import "./TxHelper.sol";

library TransferHelper {
    struct TransferData {
        bytes16[] activeSecurityIDs;
        uint256 sum;
        uint256 numSecurityIds;
    }

    function calculateTransferData(
        mapping(bytes16 => mapping(bytes16 => bytes16[])) storage activeSecurityIdsByStockClass,
        mapping(bytes16 => mapping(bytes16 => ActivePosition)) storage activePositions,
        bytes16 transferorStakeholderId,
        bytes16 stockClassId,
        uint256 quantity
    ) external view returns (TransferData memory) {
        bytes16[] memory activeSecurityIDs = activeSecurityIdsByStockClass[transferorStakeholderId][stockClassId];
        uint256 sum = 0;
        uint256 numSecurityIds = 0;

        for (uint256 index = 0; index < activeSecurityIDs.length; index++) {
            ActivePosition memory activePosition = activePositions[transferorStakeholderId][activeSecurityIDs[index]];
            sum += activePosition.quantity;

            if (sum >= quantity) {
                numSecurityIds += 1;
                break;
            } else {
                numSecurityIds += 1;
            }
        }

        return TransferData({ activeSecurityIDs: activeSecurityIDs, sum: sum, numSecurityIds: numSecurityIds });
    }

    function executeTransfer(
        mapping(bytes16 => mapping(bytes16 => ActivePosition)) storage activePositions,
        bytes16 transferorStakeholderId,
        bytes16 transfereeStakeholderId,
        bytes16 stockClassId,
        uint256 quantity,
        uint256 share_price,
        TransferData memory transferData,
        function(bytes16, bytes16, bytes16, uint256, uint256, bytes16) internal _transferSingleStock
    ) internal {
        uint256 remainingQuantity = quantity;

        for (uint256 index = 0; index < transferData.numSecurityIds; index++) {
            ActivePosition memory activePosition = activePositions[transferorStakeholderId][transferData.activeSecurityIDs[index]];

            uint256 transferQuantity;

            if (activePosition.quantity <= remainingQuantity) {
                transferQuantity = activePosition.quantity;
            } else {
                transferQuantity = remainingQuantity;
            }

            _transferSingleStock(
                transferorStakeholderId,
                transfereeStakeholderId,
                stockClassId,
                transferQuantity,
                share_price,
                transferData.activeSecurityIDs[index]
            );

            remainingQuantity -= transferQuantity;

            if (remainingQuantity == 0) {
                break;
            }
        }
    }

    function transferSingleStock(
        mapping(bytes16 => mapping(bytes16 => ActivePosition)) storage activePositions,
        bytes16 transferorStakeholderId,
        bytes16 transfereeStakeholderId,
        bytes16 stockClassId,
        uint256 quantity,
        uint256 sharePrice,
        bytes16 securityId,
        function(StockIssuance memory) internal _issueStock,
        function(StockIssuance memory) internal _updateContext,
        function(StockTransfer memory) internal _transferStock,
        function(bytes16, bytes16) internal _deleteActivePosition,
        function(bytes16, bytes16, bytes16) internal _deleteActiveSecurityIdsByStockClass,
        uint256 nonce
    ) internal returns (uint256) {
        ActivePosition memory transferorActivePosition = activePositions[transferorStakeholderId][securityId];

        require(transferorActivePosition.quantity >= quantity, "Insufficient shares");

        nonce++;
        StockIssuance memory transfereeIssuance = TxHelper.createStockIssuanceStructForTransfer(
            nonce,
            transfereeStakeholderId,
            quantity,
            sharePrice,
            stockClassId
        );

        _issueStock(transfereeIssuance);
        _updateContext(transfereeIssuance);

        uint256 balanceForTransferor = transferorActivePosition.quantity - quantity;

        bytes16 balance_security_id;

        if (balanceForTransferor > 0) {
            nonce++;
            StockIssuance memory transferorBalanceIssuance = TxHelper.createStockIssuanceStructForTransfer(
                nonce,
                transferorStakeholderId,
                balanceForTransferor,
                transferorActivePosition.share_price,
                stockClassId
            );

            _issueStock(transferorBalanceIssuance);
            _updateContext(transfereeIssuance);

            balance_security_id = transferorBalanceIssuance.security_id;
        } else {
            balance_security_id = "";
        }

        nonce++;
        StockTransfer memory transfer = TxHelper.createStockTransferStruct(
            nonce,
            quantity,
            securityId,
            transfereeIssuance.security_id,
            balance_security_id
        );
        _transferStock(transfer);

        _deleteActivePosition(transferorStakeholderId, securityId);
        _deleteActiveSecurityIdsByStockClass(transferorStakeholderId, stockClassId, securityId);

        return nonce;
    }
}
