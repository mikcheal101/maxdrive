import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);

const DocumentSchema = new Schema({
    uuid: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false
    },
}, { timestamps: true });

const DocumentModel = mongoose.model('DocumentModel', DocumentSchema);

export default DocumentModel;