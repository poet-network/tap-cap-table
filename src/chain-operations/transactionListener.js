import getContractInstance from "./getContractInstances.js";
import { convertBytes16ToUUID } from "../utils/convertUUID.js";
import { convertManyToDecimal, toDecimal } from "../utils/convertToFixedPointDecimals.js";
import { updateStakeholderById, updateStockClassById } from "../db/operations/update.js";

async function startOnchainListeners(chain) {
    console.log("🌐| Initiating on-chain event listeners...");

    const { contract, provider } = await getContractInstance(chain);

    contract.on("error", (error) => {
        console.error("Error:", error);
    });

    contract.on("StakeholderCreated", async (id, _) => {
        console.log("StakeholderCreated Event Emitted!", id);

        const incomingStakeholderId = convertBytes16ToUUID(id);

        const stakeholder = await updateStakeholderById(incomingStakeholderId, { is_onchain_synced: true });

        console.log("✅ | Stakeholder confirmation onchain ", stakeholder);
    });

    contract.on("StockClassCreated", async (id, _) => {
        console.log("StockClassCreated Event Emitted!", id);

        const incomingStockClassId = convertBytes16ToUUID(id);

        const stockClass = await updateStockClassById(incomingStockClassId, { is_onchain_synced: true });

        console.log("✅ | StockClass confirmation onchain ", stockClass);
    });

    contract.on("StockTransferCreated", async (stock, event) => {
        console.log("StockTransferCreated Event Emitted!", stock.id);

        // const quantity = toDecimal(stock.quantity);

        // console.log("quantity", quantity);
    });

    // TODO: need a conversion from solidity types to OCF types.
    // @dev events return both an array and object, depending how you want to access. We're using objects
    // TODO: the conversion functions are not working properly, need to fix
    contract.on("StockIssuanceCreated", async (stock, event) => {
        console.log("StockIssuanceCreated Event Emitted!", stock.id);

        // const quantity = toDecimal(stock.quantity);
        // const sharePrice = toDecimal(stock.share_price);

        // console.log({ quantity, sharePrice });

        // const id = convertBytes16ToUUID(stock.id);
        // console.log("issuance ID converted ", id);

        // const newStockDecimals = convertManyToDecimal(stock);
        // console.log("new stock decimals ", newStockDecimals);
        //const stockIssuance = convertBytes16ToUUID(newStockDecimals);

        // console.log("stock issuance", stockIssuance);

        // console.log("newStockDecimals", newStockDecimals);

        return;

        const sharePriceOCF = {
            amount: stock.share_price.toString(),
            currency: "USD",
        };
        const block = await provider.getBlock(event.blockNumber);
        // Type represention of an ISO-8601 date, e.g. 2022-01-28
        const dateOCF = new Date(block.timestamp * 1000).toISOString().split("T")[0];
        const costBasisOCF = stock.cost_basis.toString ? { amount: stock.cost_basis.toString(), currency: "USD" } : {};

        // data validation

        //const stockIssuance = convertBytes16ToUUID(stock);

        // const createdStockIssuance = await prisma.stockIssuance.create({
        //     data: {
        //         id: stockIssuance.id,
        //         object_type: stockIssuance.object_type,
        //         stock_class_id: stockIssuance.stock_class_id,
        //         stock_plan_id: stockIssuance.stock_plan_id,
        //         share_numbers_issued: stockIssuance.share_numbers_issued.toString(), // OCF structure is [{}], check how it returns
        //         share_price: sharePriceOCF,
        //         quantity: stock.quantity.toString(),
        //         vesting_terms_id: stockIssuance.vesting_terms_id,
        //         cost_basis: costBasisOCF,
        //         stock_legend_ids: stockIssuance.stock_legend_ids,
        //         issuance_type: stockIssuance.issuance_type,
        //         comments: stockIssuance.comments,
        //         security_id: stockIssuance.security_id,
        //         date: dateOCF,
        //         custom_id: stockIssuance.custom_id,
        //         stakeholder_id: stockIssuance.stakeholder_id,
        //         board_approval_date: stockIssuance.board_approval_date,
        //         stockholder_approval_date: stockIssuance.stockholder_approval_date,
        //         consideration_text: stockIssuance.consideration_text,
        //         security_law_exemptions: stockIssuance.security_law_exemptions,
        //     },
        // });

        console.log("New Stock Issuance Object Created !", createdStockIssuance);
    });
}

export default startOnchainListeners;
