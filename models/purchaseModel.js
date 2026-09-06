import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    purchaseToken: {
        type: String
    },
    platform: {
        type: String
    },
    createdAt: {
        type: Date
    }
}, { collection: "purchases" });

export default mongoose.model("Purchases", purchaseSchema);
