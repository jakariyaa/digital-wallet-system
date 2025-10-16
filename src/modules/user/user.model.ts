

import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { UserDocument } from '../../types/user.types';
import Wallet from '../wallet/wallet.model';

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
      select: false, 
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


userSchema.post('save', async function (doc) {
  try {
    
    const existingWallet = await Wallet.findOne({ userId: doc._id });
    
    if (!existingWallet) {
      
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


userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};





const User = mongoose.model<UserDocument>('User', userSchema);

export default User;