import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    storyId: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { collection: "likes" });

export default mongoose.model("Likes", likeSchema); 