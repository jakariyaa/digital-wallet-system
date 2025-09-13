// src/modules/user/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import Wallet from '../wallet/wallet.model';
import { UserDocument } from '../../types/user.types';

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'agent'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Create wallet after user is saved
userSchema.post('save', async function (doc) {
  try {
    // Check if wallet already exists for this user
    const existingWallet = await Wallet.findOne({ userId: doc._id });
    
    if (!existingWallet) {
      // Create wallet with initial balance
      const initialBalance = parseInt(process.env.INITIAL_WALLET_BALANCE || '50');
      await Wallet.create({
        userId: doc._id,
        balance: initialBalance,
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// The 'unique: true' option on the email field already creates an index
// This line is intentionally left blank to avoid duplicate indexes

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;