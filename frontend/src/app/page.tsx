"use client";

import { useCallback, useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import dynamic from "next/dynamic";
import { ChatSidebar } from "@/components/chat-sidebar";
import { CritiqueWorkspace } from "@/components/critique-workspace";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Suggestion, Analysis, AudienceAnalysis } from "@/types";
import { v4 as uuidv4 } from 'uuid';

const ModeToggle = dynamic(() => import("@/components/mode-toggle").then(mod => mod.ModeToggle), { ssr: false });

export type Chat = {
  id: string;
  title: string;
  text: string;
  originalText: string;
  suggestions: Suggestion[];
  analysis: Analysis | null;
  audience_analysis: AudienceAnalysis | null;
  model: string;
  audience: string;
  createdAt: number;
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [chats, setChats] = useLocalStorage<Chat[]>("chats", []);
  const [activeChatId, setActiveChatId] = useLocalStorage<string | null>("activeChatId", null);
  const [customPrompt, setCustomPrompt] = useLocalStorage<string>("customPrompt", "");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      text: "",
      originalText: "",
      suggestions: [],
      analysis: null,
      audience_analysis: null,
      model: "google",
      audience: "Young Entrepreneur",
      createdAt: Date.now(),
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  const handleSaveChat = useCallback((updatedChat: Chat) => {
    const newChats = chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat);
    setChats(newChats);
  }, [chats, setChats]);

  const handleDeleteChat = (id: string) => {
    const newChats = chats.filter(chat => chat.id !== id);
    setChats(newChats);
    if (activeChatId === id) {
      setActiveChatId(newChats[0]?.id || null);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="h-screen">
       <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={setActiveChatId}
            onDeleteChat={handleDeleteChat}
            customPrompt={customPrompt}
            onSaveCustomPrompt={setCustomPrompt}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          {activeChat ? (
            <CritiqueWorkspace
              key={activeChat.id}
              chat={activeChat}
              onSave={handleSaveChat}
              customPrompt={customPrompt}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">No active chat</h2>
                <p className="text-muted-foreground">
                  Select a chat from the sidebar or create a new one.
                </p>
              </div>
        </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
      </main>
  );
}
