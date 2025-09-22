export function avatarUrlOf(username?: string, avatar?: string | null) {
  return avatar && avatar.length > 0
    ? avatar
    : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
        username || "guest"
      )}`;
}
