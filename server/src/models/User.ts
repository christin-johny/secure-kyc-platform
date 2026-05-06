import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../domain/entities/IUser';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false 
  },
  kycImageKey: {
    type: String,
    default: null
  },
  kycVideoKey: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre<IUserDocument>('save', async function(next: any) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;
