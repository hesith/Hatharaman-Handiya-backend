import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
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
    },
    rate: {
        type: Number,
        required: true
    }
}, { collection: "ratings" });

export default mongoose.model("Ratings", ratingSchema); 