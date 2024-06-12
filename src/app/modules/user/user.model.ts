import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../../config';

interface TUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
}

const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'] },
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function (next) {
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

const User = model<TUser>('User', userSchema);

export default User;
