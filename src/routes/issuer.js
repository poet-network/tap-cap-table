import { Router } from "express";
import { v4 as uuid } from "uuid";

import issuerSchema from "../../ocf/schema/objects/Issuer.schema.json" assert { type: "json" };
import deployCapTable from "../chain-operations/deployCapTable.js";
import { createIssuer } from "../db/operations/create.js";
import { countIssuers, readIssuerById } from "../db/operations/read.js";
import { convertUUIDToBytes16 } from "../utils/convertUUID.js";
import validateInputAgainstOCF from "../utils/validateInputAgainstSchema.js";

import { contractCache } from "../utils/caches.js";
import startOnchainListeners from "../chain-operations/transactionListener.js";

const issuer = Router();

issuer.get("/", async (req, res) => {
    res.send(`Hello issuer!`);
});

//WIP get routes are currently fetching offchain.
issuer.get("/id/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { issuerId, type, role } = await readIssuerById(id);

        res.status(200).send({ issuerId, type, role });
    } catch (error) {
        console.error(`error: ${error}`);
        res.status(500).send(`${error}`);
    }
});

issuer.get("/total-number", async (req, res) => {
    try {
        const totalIssuers = await countIssuers();
        res.status(200).send(totalIssuers);
    } catch (error) {
        console.error(`error: ${error}`);
        res.status(500).send(`${error}`);
    }
});

issuer.post("/create", async (req, res) => {
    const { chain } = req;

    try {
        // OCF doesn't allow extra fields in their validation
        const { shares_authorized, shares_issued } = req.body
        const incomingIssuerToValidate = {
            id: uuid(),
            object_type: "ISSUER",
            ...req.body,
        };

        // TODO: Sync with Vic about pypassing intitial shares issuer & initial shares authorized for ocf
        // what's the difference between *initial_shares_authorized* and *shares_authorized*

        console.log("issuer to validate", incomingIssuerToValidate);

        await validateInputAgainstOCF(incomingIssuerToValidate, issuerSchema);

        const issuerIdBytes16 = convertUUIDToBytes16(incomingIssuerToValidate.id);
        console.log("issuer id bytes16 ", issuerIdBytes16);
        const { contract, provider, address, issuanceLib, transferLib, cancellationLib } = await deployCapTable(
            chain,
            issuerIdBytes16,
            incomingIssuerToValidate.legal_name,
            incomingIssuerToValidate.initial_shares_authorized
        );

        // add contract to the cache and start listener
        contractCache[incomingIssuerToValidate.id] = { contract, provider };
        startOnchainListeners(contract, provider, incomingIssuerToValidate.id, issuanceLib, transferLib, cancellationLib);

        const incomingIssuerForDB = {
            ...incomingIssuerToValidate,
            deployed_to: address,
        };

        const issuer = await createIssuer(incomingIssuerForDB);

        console.log("Issuer created offchain:", issuer);

        res.status(200).send({ issuer });
    } catch (error) {
        console.error(`error: ${error}`);
        res.status(500).send(`${error}`);
    }
});

export default issuer;
