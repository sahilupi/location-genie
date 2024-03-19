export interface ChatUser {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  userId: string;
  lastMessage: ChatMessage;
}

export interface ChatSearchedUser extends ChatUser {
  userName: string;
  id: string;
}

export interface ChatMessage {
  id?: number;
  currentUserId?: string;
  senderId: string;
  message: string;
  recieverId: string;
  isUnread?: boolean;
  userRole?: number;
  isSent?: boolean;
  createdDate: string;
  messageType: string;
}

export interface ChatOnlineUser {
  key: string;
  value: string;
}
