import { Router } from 'express';
import { isAdmin } from '../middleware/isAdmin';

import { register, login, refresh, logout } from '../controllers/auth.controller';

const router = Router();



router.post('/register', isAdmin, register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
