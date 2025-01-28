import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    },
    statusId: {
        type: Number
    }
}, { collection: "stories" });

export default mongoose.model("Story", storySchema); 