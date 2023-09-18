"use client";

import { Conversation, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createConversation,
  getConversations,
  getCurrUserId,
  getUserByEmail,
} from "@/lib/utils";

export interface ConversationWithMembers extends Conversation {
  members: User[];
}

export default function ChatsPage() {
  const { data: session, status } = useSession({ required: true });

  const [currUserId, setCurrUserId] = useState("");
  const [conversations, setConversations] = useState<ConversationWithMembers[]>(
    []
  );
  const [loading, setLoading] = useState(status === "loading");
  const [newChat, setNewChat] = useState("");

  const fetchCurrUser = () => {
    getCurrUserId(session)
      .then((cuId: string) => {
        setCurrUserId(cuId);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchConversations = () => {
    getConversations(currUserId)
      .then((convs: ConversationWithMembers[]) => {
        setConversations(convs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchCurrUser();
  }, [fetchCurrUser]);

  useEffect(() => {
    setLoading(true);
    fetchConversations();
  }, [currUserId, fetchConversations]);

  const getSenderFromConversation = (conv: ConversationWithMembers) => {
    return conv.members.find((m) => m.id !== currUserId);
  };

  const handleNewChat = async () => {
    setLoading(true);
    getUserByEmail(newChat)
      .then((receiver) => {
        if (receiver) {
          createConversation([receiver.id, currUserId]).then(
            (conv: ConversationWithMembers | null) => {
              if (conv) {
                setConversations((prev) => [...prev, conv]);
              }
            }
          );
        } else {
          alert("could not create chat");
        }
      })
      .finally(() => {
        setNewChat("");
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="container rounded flex flex-col justify-center items-center bg-blue-50 w-2/3 max-w-xl h-fit p-4">
        <h1 className="text-3xl">Chats Page</h1>
        <hr className="my-4 h-px w-11/12" />
        {!loading ? (
          <div className="flex flex-col justify-center items-center w-full space-y-4 text-xl">
            {conversations.map((conv, i) => {
              const sender = getSenderFromConversation(conv);
              return (
                <div
                  className="rounded bg-white w-5/6 max-w-sm h-fit px-4 py-2"
                  key={i}
                >
                  <Link
                    className="flex items-center"
                    href={`/chats/${conv.id}`}
                  >
                    <Image
                      className="rounded-full mr-2"
                      src={sender?.profilePicture as string}
                      alt="Profile Pic"
                      width={32}
                      height={32}
                    />
                    <h1 className="text-xl">{sender?.name}</h1>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-lg italic text-neutral-500">Loading...</p>
        )}

        <div className="rounded bg-white w-5/6 max-w-sm h-fit mt-4 flex">
          <input
            className="text-xl w-full h-full px-4 py-2 focus:outline-none placeholder:italic"
            type="email"
            placeholder="email..."
            value={newChat}
            onChange={(e) => setNewChat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNewChat()}
          />
          <button
            onClick={handleNewChat}
            className="rounded bg-cyan-700 text-white px-4"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
