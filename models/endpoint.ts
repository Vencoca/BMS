import mongoose, { Schema, models, Document } from "mongoose";

export interface IEndpoint extends Document{
    url: string,
    secret: string
}

const EndpointSchema = new Schema<IEndpoint>({
    url: {
        type: String,
        unique: true,
        required: true,
    },
    secret: {
        type: String,
        required: true,
    },
}, { timestamps: true})

export const Endpoint = models.endpoint|| mongoose.model("Endpoint", EndpointSchema);
export default Endpoint