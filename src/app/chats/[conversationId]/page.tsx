"use client";

import { getChats, getConversationById, getCurrUserId } from "@/lib/utils";
import type { Message, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ConversationWithMembers } from "../page";
import { type Socket, io } from "socket.io-client";

export default function ParticularConversation({
  params,
}: {
  params: { conversationId: string };
}) {
  const { data: session, status } = useSession({ required: true });
  const [currUserId, setCurrUserId] = useState("");
  const [conversation, setConversation] =
    useState<ConversationWithMembers | null>();
  const [sender, setSender] = useState<User>();
  const [chats, setChats] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");

  const socket = useRef<Socket>();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrUserId(session).then((cuId) => {
      setCurrUserId(cuId);
    });

    getConversationById(params.conversationId).then((conv) => {
      setConversation(conv);
    });

    socket.current = io("ws://localhost:8900");
    socket.current.on(
      "getMessage",
      ({
        senderId,
        text,
        timestamp,
      }: {
        senderId: string;
        text: string;
        timestamp: Date;
      }) => {
        setChats((prev) => [
          ...prev,
          {
            id: "",
            conversationId: params.conversationId,
            senderId: senderId,
            text: text,
            timestamp: timestamp,
          },
        ]);
      }
    );
  }, []);

  useEffect(() => {
    socket.current?.on("welcome", (msg: string) => {
      console.log(msg);
    });
  }, [socket]);

  useEffect(() => {
    setSender(conversation?.members.find((m) => m.id !== currUserId));
  }, [conversation]);

  useEffect(() => {
    if (currUserId) {
      getChats(params.conversationId).then((c) => {
        setChats(c);
      });

      socket.current?.emit("addUser", currUserId);
      socket.current?.on("getUsers", (users) => console.log(users));
    }
  }, [currUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [chats]);

  const sendMsg = async () => {
    const res: { data: { success: boolean; message: Message } } =
      await axios.post("/api/chats/sendMsg", {
        message: newMsg,
        senderId: currUserId,
        conversationId: params.conversationId,
      });

    if (res.data.success) {
      setChats((prev) => [...prev, res.data.message]);
      const receiver = conversation?.members.find((m) => m.id !== currUserId);
      socket.current?.emit("sendMessage", {
        senderId: currUserId,
        receiverId: receiver?.id,
        text: newMsg,
        timestamp: new Date(0),
      });
    } else {
      console.log("could not send msg");
    }

    setNewMsg("");
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="container bg-blue-50 w-2/3 max-w-2xl h-5/6 flex flex-col items-center p-4">
        <div className="header w-full rounded bg-white flex items-center px-4 py-2">
          {sender && (
            <>
              <Image
                className="rounded-full mr-2"
                src={sender?.profilePicture as string}
                alt="Profile Photo"
                width={32}
                height={32}
              />
              <h1 className="text-xl">{sender?.name}</h1>
            </>
          )}
        </div>
        <div className="chats flex-grow bg-white w-full my-4 flex flex-col space-y-4 overflow-auto p-4 py-0 self-start">
          {chats.map((chat, i) => {
            return (
              <div
                key={i}
                className={`rounded w-fit max-w-sm px-3 py-1 text-lg ${
                  chat.senderId === currUserId
                    ? "self-end bg-blue-500 text-blue-50"
                    : "self-start bg-blue-200 text-blue-900"
                }`}
              >
                {chat.text}
              </div>
            );
          })}
          <span ref={scrollRef} className="h-0"></span>
        </div>
        <div className="footer w-full min-h-14 rounded bg-white flex">
          <input
            className="h-full px-4 py-2 text-xl flex-grow focus:outline-none"
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
          />
          <button
            className="bg-cyan-800 text-white text-xl h-full rounded px-4 py-2"
            onClick={sendMsg}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
