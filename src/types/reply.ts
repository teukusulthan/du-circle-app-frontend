export type Reply = {
  id: number;
  content: string;
  image?: string | null;
  created_at: string;
  user: {
    id: number;
    username: string;
    name: string;
    profile_picture?: string | null;
  };
  likes: number;
  isLiked: boolean;
};
