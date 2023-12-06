import { ethers } from "ethers";
import { config } from "dotenv";
import CAP_TABLE from "../../chain/out/CapTable.sol/CapTable.json" assert { type: "json" };
import getTXLibContracts from "../utils/getLibrariesContracts.js";

config();

async function getLocalContractInstance(address) {
    const CONTRACT_ADDRESS_LOCAL = address;

    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_FAKE_ACCOUNT;
    const LOCAL_RPC_URL = process.env.LOCAL_RPC_URL;

    const customNetwork = {
        // chainId: 31337,
        chainId: 84531,
        name: "local",
    };

    const provider = new ethers.JsonRpcProvider(LOCAL_RPC_URL, customNetwork);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS_LOCAL, CAP_TABLE.abi, wallet);
    const libraries = getTXLibContracts(contract.target, wallet);
    return { contract, provider, libraries };
}

async function getOptimismGoerliContractInstance(address) {
    return getTestnetContractInstance(address, process.env.OPTIMISM_GOERLI_RPC_URL);
}

async function getBaseGoerliContractInstance(address) {
    return getTestnetContractInstance(address, process.env.BASE_GOERLI_RPC_URL);
}

async function getTestnetContractInstance(address, rpcUrl) {
    const CONTRACT_ADDRESS = address;
    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_POET_TEST;

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
    const libraries = getTXLibContracts(contract.target, wallet);

    return { contract, provider, libraries };
}

async function getContractInstance(chain, address) {
    if (chain === "local") {
        return getLocalContractInstance(address);
    } else if (chain === "optimism-goerli") {
        return getOptimismGoerliContractInstance(address);
    } else if (chain === "base-goerli") {
        return getBaseGoerliContractInstance(address);
    } else {
        throw new Error(`Unsupported chain: ${chain}`);
    }
}

export default getContractInstance;
