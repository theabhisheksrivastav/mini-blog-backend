// routes/posts.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { getPosts, getPostById, addPost, updatePost, deletePost } from '../controllers/posts.controller';

const router = Router();
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', isAuthenticated, addPost);
router.put('/update/:id', isAuthenticated, updatePost);
router.delete('/delete/:id', isAuthenticated, deletePost);

export default router;
