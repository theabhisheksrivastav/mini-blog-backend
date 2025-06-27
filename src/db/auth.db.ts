import { join } from 'path';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { AuthSchema } from '../models/user.model';

const file = join(__dirname, '../../auth.json');
const adapter = new JSONFileSync<AuthSchema>(file);
export const authDb = new LowSync<AuthSchema>(adapter, { users: [] });

authDb.read();
authDb.write();
