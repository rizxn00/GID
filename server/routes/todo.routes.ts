import express from 'express';
import { create, getByUser, update, remove, completed } from '../controllers/todo.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, getByUser);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);
router.get('/completed', authMiddleware, completed);

export default router;
