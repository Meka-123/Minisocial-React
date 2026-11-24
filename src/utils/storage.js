const STORAGE_KEY = "minisocial-data-v1";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validList(value) {
  return Array.isArray(value) ? value : [];
}

function validStringList(value) {
  return [...new Set(validList(value).filter((item) => typeof item === "string"))];
}

function normalizeState(value) {
  if (!isRecord(value)) {
    return { users: [], posts: [], friendships: [], chats: [], currentUserId: null };
  }
  const users = validList(value.users)
    .filter((user) => isRecord(user) && typeof user.id === "string")
    .map((user) => ({
      id: user.id,
      name: typeof user.name === "string" ? user.name : "",
      email: typeof user.email === "string" ? user.email : "",
      password: typeof user.password === "string" ? user.password : "",
    }));
  const userIds = new Set(users.map((user) => user.id));
  return {
    users,
    posts: validList(value.posts)
      .filter((post) => isRecord(post) && typeof post.id === "string")
      .map((post) => ({
        id: post.id,
        authorId: typeof post.authorId === "string" ? post.authorId : "",
        text: typeof post.text === "string" ? post.text : "",
        createdAt: typeof post.createdAt === "string" ? post.createdAt : new Date(0).toISOString(),
        likes: validStringList(post.likes),
        reposts: validStringList(post.reposts),
        comments: validList(post.comments)
          .filter((comment) => isRecord(comment) && typeof comment.id === "string")
          .map((comment) => ({
            id: comment.id,
            authorId: typeof comment.authorId === "string" ? comment.authorId : "",
            text: typeof comment.text === "string" ? comment.text : "",
            createdAt: typeof comment.createdAt === "string" ? comment.createdAt : new Date(0).toISOString(),
          })),
      })),
    friendships: validList(value.friendships).filter((friendship) =>
      isRecord(friendship) &&
      typeof friendship.userId === "string" &&
      typeof friendship.friendId === "string" &&
      userIds.has(friendship.userId) &&
      userIds.has(friendship.friendId) &&
      friendship.userId !== friendship.friendId,
    ),
    chats: validList(value.chats)
      .filter((chat) => isRecord(chat) && typeof chat.id === "string" && Array.isArray(chat.participantIds))
      .map((chat) => ({
        id: chat.id,
        participantIds: validStringList(chat.participantIds).filter((id) => userIds.has(id)),
        messages: validList(chat.messages)
          .filter((message) => isRecord(message) && typeof message.id === "string")
          .map((message) => ({
            id: message.id,
            senderId: typeof message.senderId === "string" ? message.senderId : "",
            text: typeof message.text === "string" ? message.text : "",
            createdAt: typeof message.createdAt === "string" ? message.createdAt : new Date(0).toISOString(),
          })),
      })),
    currentUserId: users.some((user) => user.id === value.currentUserId) ? value.currentUserId : null,
  };
}

export function getAppData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const initial = normalizeState(null);
      saveAppData(initial);
      return initial;
    }
    return normalizeState(JSON.parse(saved));
  } catch (error) {
    console.error("MiniSocial could not read saved data.", error);
    return normalizeState(null);
  }
}

export function saveAppData(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(data)));
  } catch (error) {
    console.error("MiniSocial could not save data.", error);
    throw new Error("Your changes could not be saved. Check your browser storage and try again.");
  }
}

export function commitAppData(data) {
  const nextData = normalizeState(data);
  saveAppData(nextData);
  return nextData;
}

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
