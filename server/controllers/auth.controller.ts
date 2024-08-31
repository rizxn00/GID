import { Request, Response } from 'express';
import { getUserDetails, registerUser } from '../services/auth.service';
import { loginUser } from '../services/auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if(!username || !email || !password) {
    res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = await registerUser(username, email, password);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser?._id,
        username: newUser?.username,
        email: newUser?.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password) {
    res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await loginUser(email, password);
    if (result) {
      const { user, token } = result;
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password.' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeatils =  async (req: CustomRequest, res: Response) => {
  try {
    let userId: Types.ObjectId | undefined;

        if (typeof req.user === 'string') {
            userId = new Types.ObjectId(req.user);
        } else if (req.user && typeof req.user === 'object' && 'id' in req.user) {
            userId = new Types.ObjectId(req.user.id);
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
    const user = await getUserDetails(userId)
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};