import mongoose, { Document, Schema } from "mongoose";

export interface IPassword extends Document {
  name: string;
  usernameOrUserId: string;
  websiteLink?: string;
  password: string;
  userId: String;
  tag?: string;
  faviconUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const passwordSchema: Schema<IPassword> = new Schema<IPassword>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    usernameOrUserId: {
      type: String,
      required: [true, "Username or User ID is required"],
      trim: true,
    },
    websiteLink: {
      type: String,
      trim: true,
      // Basic URL validation using a regex pattern
      match: [
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i,
        "Please enter a valid URL",
      ],
      default: "",
    },
    tag: {
      type: String,
      trim: true,
    },
    faviconUrl: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userId: {
      type: String,
      ref: "User", // This still indicates a reference to your User model, but the stored value will be a string
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);
const Password = mongoose.model<IPassword>("Password", passwordSchema);

export default Password;
