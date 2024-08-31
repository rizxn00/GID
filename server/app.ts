import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import authroutes from './routes/auth.routes'
import todoRoutes from './routes/todo.routes'


dotenv.config();

const app: Application = express();
const origin: string = process.env.ORIGIN || 'http://localhost:3000'


app.use(express.json()); 
app.use (cors ({
  origin:origin,
  methods:['GET','POST', 'PUT', 'DELETE'],
  credentials:true
}))

connectDB();
app.get('/', (req, res) => {
    res.send('Welcome to the GID API!');
  });
app.use('/api/auth', authroutes)
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
