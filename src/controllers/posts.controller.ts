import { Request, Response } from 'express';
import { db } from '../db/post.db';
import { nanoid } from 'nanoid';

const getPosts = (_: Request, res: Response) => {
  db.read();

  const summarizedPosts = db.data!.posts.map(post => ({
    ...post,
    content: post.content.split(' ').slice(0, 12).join(' ') + '...'
  }));

  res.json(summarizedPosts);
};

const getPostById = (req: Request, res: Response) => {
  const { id } = req.params;  
  db.read();
  const post = db.data!.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'not found' });
  res.json(post);
}

const addPost = (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title & body required' });

  const post = { id: nanoid(), title, content, userId: req.user?.userId || 'unknown' };
  db.data!.posts.push(post);
  db.write();
  res.status(201).json(post);
};

const updatePost = (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  const { id } = req.params;
  const { title, content } = req.body;
  db.read();
  const post = db.data!.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'not found' });
  if (post.userId !== req.user?.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  post.title = title ?? post.title;
  post.content = content ?? post.content;
  db.write();
  res.json(post);
};

const deletePost = (req: Request, res: Response) => {
  const { id } = req.params;
  db.read();
  const idx = db.data!.posts.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const post = db.data!.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'not found' });
  if (post.userId !== req.user?.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  db.data!.posts.splice(idx, 1);
  db.write();
  res.status(204).end();
};

export { getPosts, getPostById, addPost, updatePost, deletePost };