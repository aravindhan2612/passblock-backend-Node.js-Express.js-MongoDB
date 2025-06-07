import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  _id: { type: String, default: uuidv4 },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true,
});

// ✅ Export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
