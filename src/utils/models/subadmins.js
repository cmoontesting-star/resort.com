
import mongoose from "mongoose";
const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "subadmin"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superadmins",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

})

const SubAdmin = mongoose.models.SubAdmin || mongoose.model("SubAdmin", schema);
export default SubAdmin;