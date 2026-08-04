import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: "About Us",
        },
        description: {
            type: String,
            required: true,
        },
        bannerImage: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.models.AboutUs ||
    mongoose.model("AboutUs", AboutUsSchema);