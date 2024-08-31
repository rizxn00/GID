import { Request, Response } from 'express';
import { createTodo, getTodosByUser, updateTodo, deleteTodo, getCompletedTodos } from '../services/todo.service';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

export const create = async (req: CustomRequest, res: Response) => {
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

        const todo = await createTodo({ ...req.body, user: userId });
        res.status(201).json({ message: "Todo created successfully", data: todo });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getByUser = async (req: CustomRequest, res: Response) => {
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

        const todos = await getTodosByUser(userId);
        res.status(200).json(todos);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const updatedTodo = await updateTodo(req.params.id, req.body);
        res.status(200).json({ message: "Todo updated successfully", data: updatedTodo });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const deletedTodo = await deleteTodo(req.params.id);
        if (deletedTodo) { res.status(200).json({ messgae: "Todo deleted successfully", data: deletedTodo }); }
        else { res.status(404).json({ message: "Todo not found" }) }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const completed = async (req: CustomRequest, res: Response) => {
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

        const todos = await getCompletedTodos(userId);
        res.status(200).json(todos);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};