export type FollowsTab = "followers" | "following";

export type FollowUser = {
  id: string | number;
  username: string;
  name: string;
  avatar: string | null;
  is_following?: boolean;
};

export type FollowersListResponse = {
  status: "success" | "error";
  message?: string;
  data?: { followers: FollowUser[] };
};

export type FollowActionResponse = {
  status: "success" | "error";
  message: string;
  data?: { user_id: string | number; is_following: boolean };
};
