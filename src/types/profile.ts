export type ProfilePanelType = {
  user: {
    name: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    following: number;
    followers: number;
  };
  suggestions?: Array<{
    id: number | string;
    name: string;
    username: string;
    avatar?: string | null;
    isFollowing?: boolean;
  }>;
  onEdit?: () => void;
  onFollowToggle?: (username: string) => void;
};
