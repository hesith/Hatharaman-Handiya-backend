import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    storyId: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    }
}, { collection: "comments" });

export default mongoose.model("Comments", commentSchema); 