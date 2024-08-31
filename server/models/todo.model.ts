import { Schema, model, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  completed: Boolean;
  user: Schema.Types.ObjectId; 
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

export default model<ITodo>('Todo', todoSchema);
