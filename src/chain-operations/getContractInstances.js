import { ethers } from "ethers";
import { config } from "dotenv";
config();

import CAP_TABLE from "../../chain/out/CapTable.sol/CapTable.json" assert { type: "json" };
import CAP_TABLE_ISSUANCE from "../../chain/out/StockIssuance.sol/StockIssuanceLib.json" assert { type: "json" };
import CAP_TABLE_TRANSFER from "../../chain/out/StockTransfer.sol/StockTransferLib.json" assert { type: "json" };

const { abi } = CAP_TABLE;
const { abi: abiIssuance, bytecode: bytecodeIssuance } = CAP_TABLE_ISSUANCE;
const { abi: abiTransfer, bytecode: bytecodeTransfer } = CAP_TABLE_TRANSFER;

async function getLocalContractInstance(address) {
    // if deployed using forge script
    //const CONTRACT_ADDRESS_LOCAL = require("../chain/broadcast/CapTable.s.sol/31337/run-latest.json").transactions[0].contractAddress;
    const CONTRACT_ADDRESS_LOCAL = address; // fill in from capTableFactory

    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_FAKE_ACCOUNT;
    const LOCAL_RPC_URL = process.env.LOCAL_RPC_URL;

    const customNetwork = {
        chainId: 31337,
        name: "local",
    };

    const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL, customNetwork);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS_LOCAL, abi, wallet);

    const issuanceLib = new ethers.Contract(contract.target, abiIssuance, wallet);
    const transferLib = new ethers.Contract(contract.target, abiTransfer, wallet);

    return { contract, provider, issuanceLib, transferLib };
}

async function getOptimismGoerliContractInstance(address) {
    // if deployed using forge script
    // const CONTRACT_ADDRESS_OPTIMISM_GOERLI = require("../chain/broadcast/CapTable.s.sol/420/run-latest.json").transactions[0].contractAddress;
    const CONTRACT_ADDRESS_OPTIMISM_GOERLI = address;
    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_POET_TEST;

    const provider = new ethers.providers.JsonRpcProvider(process.env.OPTIMISM_GOERLI_RPC_URL);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS_OPTIMISM_GOERLI, abi, wallet);

    const issuanceLib = new ethers.Contract(contract.target, abiIssuance, wallet);
    const transferLib = new ethers.Contract(contract.target, abiTransfer, wallet);

    return { contract, provider, issuanceLib, transferLib };
}

async function getContractInstance(chain, address) {
    if (chain === "local") {
        return getLocalContractInstance(address);
    } else if (chain === "optimism-goerli") {
        return getOptimismGoerliContractInstance(address);
    } else {
        throw new Error(`Unsupported chain: ${chain}`);
    }
}

export default getContractInstance;
