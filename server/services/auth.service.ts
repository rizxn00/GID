import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const registerUser = async (username: string, email: string, password: string): Promise<IUser | null> => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('User with this email already exists.');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already taken.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return newUser;
};



export const loginUser = async (email: string, password: string): Promise<{ user: IUser; token: string } | null> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: '10d' }
  );

  return { user, token };
};


export const getUserDetails = async (userId: Types.ObjectId | undefined): Promise<IUser | null> => {
  try {
    return await User.findById(userId).select('-password'); // Exclude password from the result
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};