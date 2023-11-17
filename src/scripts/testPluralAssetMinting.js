import axios from "axios";
import sleep from "../utils/sleep.js";
import { issuer, issuerStakeholder, stakeholder1, stakeholder2, stockClass } from "./solar1.js";

// @dev this script needs to run first in order to run the others scripts in this file
const main = async () => {
    console.log("⏳ | Creating issuer…");
    // create issuer
    const issuerResponse = await axios.post("http://localhost:8080/issuer/create", issuer);

    console.log("✅ | Issuer response ", issuerResponse.data);

    await sleep(3000);

    console.log("⏳| Creating stock class");

    // create stockClass
    const stockClassResponse = await axios.post("http://localhost:8080/stock-class/create", stockClass(issuerResponse.data.issuer._id));

    console.log("✅ | stockClassResponse", stockClassResponse.data);

    await sleep(3000);

    console.log("⏳ | Creating issuer stakeholder");

    // create two stakeholders
    const issuerStakeholderResponse = await axios.post("http://localhost:8080/stakeholder/create", issuerStakeholder(issuerResponse.data.issuer._id));

    console.log("✅ | issuerStakeholderResponse", issuerStakeholderResponse.data);
    console.log("✅ | finished");

    await sleep(3000);

    console.log("⏳ | Creating second stakeholder…");

    const stakeholder1Response = await axios.post("http://localhost:8080/stakeholder/create", stakeholder1(issuerResponse.data.issuer._id));

    console.log("✅ | stakeholder1Response", stakeholder1Response.data);
};

main()
    .then()
    .catch((err) => {
        console.error(err);
    });
