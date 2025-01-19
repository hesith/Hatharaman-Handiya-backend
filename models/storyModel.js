import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    }
}, { collection: "stories" });

export default mongoose.model("Story", storySchema); 