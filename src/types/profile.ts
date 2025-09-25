export type Profile = {
  id: number | string;
  username: string;
  name: string;
  avatar?: string | null;
  banner: string | null;
  bio?: string | null;
  followers: number;
  following: number;
};

export type Suggestion = {
  id: number | string;
  username: string;
  name: string;
  avatar?: string | null;
  isFollowing?: boolean;
};

export type ProfilePanelType = {
  user: Profile;
  suggestions?: Suggestion[];
  onEdit?: () => void;
  onFollowToggle?: (username: string) => void;
  mode?: "default" | "suggestions-only";
};
