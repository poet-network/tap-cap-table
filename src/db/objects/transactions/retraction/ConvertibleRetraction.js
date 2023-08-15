import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const ConvertibleRetractionSchema = new mongoose.Schema({
    id: { type: String, default: () => uuid() },
    object_type: { type: String, default: "TX_CONVERTIBLE_RETRACTION" },
    comments: [String],
    security_id: String,
    date: String,
    reason_text: String,
});

const ConvertibleRetraction = mongoose.model("ConvertibleRetraction", ConvertibleRetractionSchema);

export default ConvertibleRetraction;
