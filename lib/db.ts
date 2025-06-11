import { join } from 'path';
import { JSONFilePreset } from 'lowdb/node';
import type { User } from '../types/user';

const dbFile = join(process.cwd(), 'users.json');
export const dbPromise = JSONFilePreset<{ users: User[] }>(dbFile, { users: [] }); 