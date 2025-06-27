export type User = {
  id: string;
  email: string;
  password: string; // hashed
  role: 'user' | 'admin';
};

export type AuthSchema = {
  users: User[];
};
