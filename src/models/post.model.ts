
export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

export type PostSchema = {
  posts: Post[];
};
