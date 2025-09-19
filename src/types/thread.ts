export type ThreadUser = {
  id: number;
  username: string;
  name: string;
  profile_picture: string | null;
};

export type Thread = {
  id: number;
  content: string;
  image?: string | null;
  user: {
    id: number;
    username: string;
    name: string;
    profile_picture?: string;
  };
  created_at: string;
  likes: number;
  reply: number;
  isLiked: boolean;
};
