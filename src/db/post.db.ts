import { join } from 'path';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { PostSchema } from '../models/post.model';

const file     = join(__dirname, '../../posts.json');
const adapter  = new JSONFileSync<PostSchema>(file);

export const db = new LowSync<PostSchema>(adapter, { posts: [] });

db.read();              
db.write();
