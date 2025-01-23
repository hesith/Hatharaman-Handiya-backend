import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    }
}, { collection: "stories" });

export default mongoose.model("Story", storySchema); 