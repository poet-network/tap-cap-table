export const issuer = {
    legal_name: "Transfer Agent Protocol",
    formation_date: "2022-08-23",
    country_of_formation: "US",
    country_subdivision_of_formation: "DE",
    tax_ids: [
        {
            tax_id: "88-3977591",
            country: "US",
        },
    ],
    email: {
        email_address: "alex@transferagentprotocol.xyz",
        email_type: "BUSINESS",
    },
    initial_shares_authorized: "10000000",
    address: {
        address_type: "LEGAL",
        street_suite: "447 Broadway\n2nd Fl #713",
        city: "New York",
        country_subdivision: "NY",
        country: "US",
        postal_code: "10013",
    },
    comments: [],
};

export const stakeholder1 = (issuerId) => {
    return {
        issuerId,
        data: {
            name: {
                legal_name: "Alex Palmer",
                first_name: "Alex",
                last_name: "Palmer",
            },
            issuer_assigned_id: "",
            stakeholder_type: "INDIVIDUAL",
            current_relationship: "EMPLOYEE",
            // "primary_contact": {
            //     "name": {
            //         "legal_name": "Alex Palmer",
            //         "first_name": "Alex",
            //         "last_name": "Palmer"
            //     },
            //     "emails": [
            //         {
            //             "email_type": "PERSONAL",
            //             "email_address": "alex@poet.network"
            //         }
            //     ],
            //     "phone_numbers": []
            // },
            // "contact_info": {},
            comments: [],
        },
    };
};

export const stockClassAuthorizedSharesAdjust = (issuerId, stock_class_id, new_shares_authorized, comments) => {
    return {
        issuerId,
        data: {
            new_shares_authorized,
            comments,
            stock_class_id,
        },
    };
};
export const issuerAuthorizedSharesAdjust = (issuerId, new_shares_authorized, comments) => {
    return {
        issuerId,
        data: {
            issuer_id: issuerId,
            new_shares_authorized,
            comments,
        },
    };
};

export const stockAccept = (issuerId, stakeholderId, stockClassId, security_id, comments) => {
    return {
        issuerId,
        data: {
            stakeholderId,
            stockClassId,
            security_id,
            comments,
        },
    };
};
export const stockRetract = (issuerId, stakeholderId, stockClassId, security_id, reason_text, comments) => {
    return {
        issuerId,
        data: {
            stakeholderId,
            stockClassId,
            security_id,
            reason_text,
            comments,
        },
    };
};

export const stockRepurchase = (issuerId, quantity, price, stakeholderId, stockClassId, security_id, comments) => {
    return {
        issuerId,
        data: {
            stakeholderId,
            stockClassId,
            security_id,
            quantity,
            comments,
            price: { amount: price, currency: "USD" },
        },
    };
};
export const stockReissue = (issuerId, stakeholderId, stockClassId, security_id, resulting_security_ids, reason_text, comments) => {
    return {
        issuerId,
        data: {
            stakeholderId,
            stockClassId,
            resulting_security_ids,
            reason_text,
            security_id,
            comments,
        },
    };
};

export const stockCancel = (issuerId, quantity, stakeholderId, stockClassId, security_id, reason_text, comments) => {
    return {
        issuerId,
        data: {
            stakeholderId,
            stockClassId,
            quantity,
            security_id,
            reason_text,
            comments,
        },
    };
};

export const stakeholder2 = (issuerId) => {
    return {
        issuerId,
        data: {
            name: {
                legal_name: "Alex Fong",
                first_name: "Alex",
                last_name: "Fong",
            },
            issuer_assigned_id: "",
            stakeholder_type: "INDIVIDUAL",
            current_relationship: "EMPLOYEE",
            // "primary_contact": {
            //     "name": {
            //         "legal_name": "Alex Fong",
            //         "first_name": "Alex",
            //         "last_name": "Fong"
            //     },
            //     "emails": [
            //         {
            //             "email_type": "PERSONAL",
            //             "email_address": "alex@plural.xyz"
            //         }
            //     ],
            //     "phone_numbers": []
            // },
            // "contact_info": {},
            comments: [],
        },
    };
};

export const stakeholder3 = (issuerId) => {
    return {
        issuerId,
        data: {
            name: {
                legal_name: "Kent Kolze",
                first_name: "Kent",
                last_name: "Kolze",
            },
            issuer_assigned_id: "",
            stakeholder_type: "INDIVIDUAL",
            current_relationship: "EMPLOYEE",
            comments: [],
        },
    };
};

export const stockClass = (issuerId) => {
    return {
        issuerId,
        data: {
            name: "Series A Common",
            class_type: "COMMON",
            default_id_prefix: "CS-A",
            initial_shares_authorized: "4000",
            // "board_approval_date": "", // IF NO DATE, then omit
            votes_per_share: "1",
            // "par_value": {}, // same as date
            price_per_share: {
                currency: "USD",
                amount: "1.23",
            },
            seniority: "1",
            // "conversion_rights": {}, // same as date
            // "liquidation_preference_multiple": "", // same as date
            // "participation_cap_multiple": "", // same as date
            comments: [],
        },
    };
};

export const stockIssuance = (issuerId, stakeholderId, stockClassId, quantity, sharePriceAmount) => {
    return {
        issuerId,
        data: {
            stakeholder_id: stakeholderId,
            stock_class_id: stockClassId,
            quantity,
            share_price: {
                currency: "USD",
                amount: sharePriceAmount,
            },
            stock_legend_ids: [],
            // "stock_plan_id": "00000000-0000-0000-0000-000000000000",
            // "share_numbers_issued": [0,0],
            // "vesting_terms_id": "00000000-0000-0000-0000-000000000000",
            // "cost_basis": {
            //     "currency": "USD",
            //     "amount": "1.20"
            // },
            // "issuance_type": "",
            comments: [],
            custom_id: "",
            // "board_approval_date": "", // omit if null
            // "stockholder_approval_date": "", // same as above
            consideration_text: "",
            security_law_exemptions: [],
        },
    };
};

export const stockTransfer = (issuerId, quantity, transferorId, transfereeId, stockClassId, sharePrice) => {
    return {
        issuerId,
        data: {
            quantity,
            transferorId,
            transfereeId,
            stockClassId,
            isBuyerVerified: true,
            sharePrice,
        },
    };
};
