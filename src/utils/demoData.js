export function getDisplayName(user) {
  return user?.name?.trim() || "MiniSocial member";
}

export function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export function areFriends(friendships, firstId, secondId) {
  return friendships.some(
    (friendship) =>
      (friendship.userId === firstId && friendship.friendId === secondId) ||
      (friendship.userId === secondId && friendship.friendId === firstId),
  );
}
