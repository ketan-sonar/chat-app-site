import { ConversationWithMembers } from "@/app/chats/page";
import { Message, User } from "@prisma/client";
import axios from "axios";
import { Session } from "next-auth";

export const getCurrUserId = async (session: Session | null) => {
  const res: { data: { success: boolean; user: User } } = await axios.post(
    "/api/user/getByEmail",
    { email: session?.user?.email }
  );
  return res.data.success ? res.data.user.id : "";
};

export const getConversations = async (currUserId: string) => {
  if (!currUserId) return [];

  const res: {
    data: { success: boolean; conversations: ConversationWithMembers[] };
  } = await axios.post("/api/conversation/get", { userId: currUserId });

  return res.data.success ? res.data.conversations : [];
};

export const getConversationById = async (id: string) => {
  if (!id) return null;

  const res: {
    data: { success: boolean; conversation: ConversationWithMembers };
  } = await axios.post("/api/conversation/getById", { id: id });

  return res.data.success ? res.data.conversation : null;
};

export const getChats = async (conversationId: string) => {
  if (!conversationId) return [];

  const res: { data: { success: boolean; chats: Message[] } } =
    await axios.post("/api/chats/get", { conversationId: conversationId });
  return res.data.success ? res.data.chats : [];
};

export const getUserByEmail = async (email: string) => {
  if (!email) return null;

  const res: { data: { success: boolean; user: User } } = await axios.post(
    "/api/user/getByEmail",
    { email }
  );
  return res.data.success ? res.data.user : null;
};

export const createConversation = async (memberIds: string[]) => {
  const res: {
    data: { success: boolean; createdConversation: ConversationWithMembers };
  } = await axios.post("/api/conversation/create", { memberIds });
  return res.data.success ? res.data.createdConversation : null;
};
