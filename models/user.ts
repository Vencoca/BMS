import mongoose, { Document, models, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
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
    },
  },
  { timestamps: true },
);

export const User = models.User || mongoose.model("User", UserSchema);
export default User;
