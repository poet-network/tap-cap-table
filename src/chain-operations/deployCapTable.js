import { config } from "dotenv";
import { ethers } from "ethers";
import CAP_TABLE from "../../chain/out/CapTable.sol/CapTable.json" assert { type: "json" };
import CAP_TABLE_FACTORY from "../../chain/out/CapTableFactory.sol/CapTableFactory.json" assert { type: "json" };
import { toScaledBigNumber } from "../utils/convertToFixedPointDecimals.js";
import getTXLibContracts from "../utils/getLibrariesContracts.js";
import { readFactory } from "../db/operations/read.js";

config();

async function deployCapTableLocal(issuerId, issuerName, initial_shares_authorized) {
    // Replace with your private key and provider endpoint
    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_FAKE_ACCOUNT;
    const customNetwork = {
        // chainId: 31337,
        chainId: 84531,
        name: "local",
    };
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", customNetwork);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    console.log("🗽 | Wallet address ", wallet.address);

    const factory = await readFactory();
    const factoryAddress = factory[0].factory_address;

    console.log("factory ", factory);

    if (!factoryAddress) {
        throw new Error(`❌ | Factory address not found`);
    }

    const capTableFactory = new ethers.Contract(factoryAddress, CAP_TABLE_FACTORY.abi, wallet);

    console.log(
        `✅ | Issuer id inside of deployment: ${issuerId},
		✅ | Issuer name inside of deployment: ${issuerName},
		✅ | With initial shares: ${initial_shares_authorized}`
    );

    const tx = await capTableFactory.createCapTable(issuerId, issuerName, toScaledBigNumber(initial_shares_authorized));
    await tx.wait();

    const capTableCount = await capTableFactory.getCapTableCount();

    const latestCapTableProxyContractAddress = await capTableFactory.capTableProxies(capTableCount - BigInt(1));

    const contract = new ethers.Contract(latestCapTableProxyContractAddress, CAP_TABLE.abi, wallet);

    console.log("⏳ | Waiting for contract to be deployed...");
    console.log("cap table contract address ", latestCapTableProxyContractAddress);
    const libraries = getTXLibContracts(latestCapTableProxyContractAddress, wallet);

    return {
        contract,
        provider,
        address: latestCapTableProxyContractAddress,
        libraries,
    };
}

async function deployCapTableOptimismGoerli(issuerId, issuerName, initial_shares_authorized) {
    return deployCapTableTestnet(issuerId, issuerName, initial_shares_authorized, process.env.OPTIMISM_GOERLI_RPC_URL);
}

async function deployCapTableBaseGoerli(issuerId, issuerName, initial_shares_authorized) {
    return deployCapTableTestnet(issuerId, issuerName, initial_shares_authorized, process.env.BASE_GOERLI_RPC_URL);
}

async function deployCapTableTestnet(issuerId, issuerName, initial_shares_authorized, rpcUrl) {
    const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY_POET_TEST;

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

    const factory = await readFactory(); // Assumes this function fetches the factory address for Goerli
    const factoryAddress = factory[0].factory_address;

    if (!factoryAddress) {
        throw new Error(`❌ | Factory address not found`);
    }

    const capTableFactory = new ethers.Contract(factoryAddress, CAP_TABLE_FACTORY.abi, wallet);

    console.log(
        `✅ | Issuer id inside of deployment: ${issuerId},
        ✅ | Issuer name inside of deployment: ${issuerName},
        ✅ | With initial shares: ${initial_shares_authorized}`
    );

    const tx = await capTableFactory.createCapTable(issuerId, issuerName, toScaledBigNumber(initial_shares_authorized));
    await tx.wait();

    const capTableCount = await capTableFactory.getCapTableCount();
    const latestCapTableProxyContractAddress = await capTableFactory.capTableProxies(capTableCount - BigInt(1));

    const contract = new ethers.Contract(latestCapTableProxyContractAddress, CAP_TABLE.abi, wallet);

    console.log("⏳ | Waiting for contract to be deployed...");
    console.log("cap table contract address ", latestCapTableProxyContractAddress);
    const libraries = getTXLibContracts(latestCapTableProxyContractAddress, wallet);

    return {
        contract,
        provider,
        address: latestCapTableProxyContractAddress,
        libraries,
    };
}

async function deployCapTable(chain, issuerId, issuerName, initial_shares_authorized) {
    if (chain === "local") {
        return deployCapTableLocal(issuerId, issuerName, initial_shares_authorized);
    } else if (chain === "optimism-goerli") {
        return deployCapTableOptimismGoerli(issuerId, issuerName, initial_shares_authorized);
    } else if (chain === "base-goerli") {
        return deployCapTableBaseGoerli(issuerId, issuerName, initial_shares_authorized);
    } else {
        throw new Error(`❌ | Unsupported chain: ${chain}`);
    }
}
export default deployCapTable;
