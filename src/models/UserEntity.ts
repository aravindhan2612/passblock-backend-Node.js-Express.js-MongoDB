import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuidv4 },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String }, // new
    dateOfBirth: { type: Date }, // new
    profilePicture: { type: String }, // new (base64 stored as string)
  },
  {
    timestamps: true,
  }
);

// ✅ Export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
