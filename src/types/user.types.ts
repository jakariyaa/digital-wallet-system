// src/types/user.types.ts
import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'agent';
  isActive: boolean;
  isApproved?: boolean; // For agents
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserDocument extends IUser, IUserMethods, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface UserModel extends mongoose.Model<UserDocument> {}