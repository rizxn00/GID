import { Types } from 'mongoose';
import Todo, { ITodo } from '../models/todo.model';

export const createTodo = async (todoData: ITodo) => {
  const todo = new Todo({
    title: todoData.title,
    completed: todoData.completed,
    user: todoData.user,
  });
  return await todo.save();
};

export const getTodosByUser = async (userId: Types.ObjectId | undefined): Promise<ITodo[]> => {
    return await Todo.find({ user: userId });
  };

export const updateTodo = async (id: string, todoData: Partial<ITodo>) => {
  return await Todo.findByIdAndUpdate(id, todoData, { new: true });
};

export const deleteTodo = async (id: string) => {
  return await Todo.findByIdAndDelete(id);
};

export const getCompletedTodos = async (userId: Types.ObjectId | undefined): Promise<ITodo[]> => {
  return await Todo.find({ user: userId, completed: true });
};
