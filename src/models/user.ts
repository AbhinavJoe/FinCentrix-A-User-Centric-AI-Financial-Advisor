import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  username: string; // Add username field
  isApproved: boolean;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  isApproved: { type: Boolean, default: false }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
