export type SearchResp = {
  status: "success" | "error";
  message?: string;
  data?: {
    users: Array<{
      id: string | number;
      username: string;
      name: string;
      followers: number;
      is_following?: boolean;
      avatar?: string | null;
    }>;
  };
};
