import express from 'express';
import { getDeatils, login, register } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/details', authMiddleware, getDeatils);

export default router;
