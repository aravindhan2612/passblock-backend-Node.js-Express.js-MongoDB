import mongoose, { Document, Schema } from 'mongoose';

export interface IPassword extends Document{
  name: string; // A descriptive name for the entry (e.g., "Google Account")
  usernameOrUserId: string; // The username or user ID associated with the account
  websiteLink?: string; // Optional: The URL of the website
  passwordHash: string; // The hashed password (never store plain passwords!)
  userId:String;
  tag?: string; //  // Reference to the User who owns this password entry
  createdAt?: Date; // Timestamp for when the entry was created
  updatedAt?: Date; // Timestamp for when the entry was last updated
}

const passwordSchema: Schema<IPassword> = new Schema<IPassword>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // 'name' is a mandatory field
      trim: true, // Remove whitespace from both ends of a string
    },
    usernameOrUserId: {
      type: String,
      required: [true, 'Username or User ID is required'],
      trim: true,
    },
    websiteLink: {
      type: String,
      trim: true,
      // Basic URL validation using a regex pattern
      match: [
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i,
        'Please enter a valid URL',
      ],
      default: '', // Default to an empty string if not provided
    },
    tag:{
      type: String,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    userId: {
      type: String,
      ref: 'User', // This still indicates a reference to your User model, but the stored value will be a string
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // Mongoose automatically adds createdAt and updatedAt fields
  }
);
const Password= mongoose.model<IPassword>('Password', passwordSchema);

export default Password;