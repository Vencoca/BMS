import mongoose, { Schema, models, Document } from "mongoose";

export interface IUserSchema extends Document{
    name: string,
    email: string,
    password: string,
}

const UserSchema = new Schema<IUserSchema>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        requied: false,
    }
}, { timestamps: true})

export const User = models.User || mongoose.model("User", UserSchema);
export default User;