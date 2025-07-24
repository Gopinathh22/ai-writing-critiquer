"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@/app/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsDialog } from "./settings-dialog";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  customPrompt: string;
  onSaveCustomPrompt: (prompt: string) => void;
}

export function ChatSidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, customPrompt, onSaveCustomPrompt }: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-muted/50">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        <Button className="w-full" onClick={onNewChat}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4 pt-0">
          {[...chats]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "p-2 rounded-lg cursor-pointer transition-colors group flex justify-between items-center",
                activeChatId === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <span className="truncate">{chat.title || "New Chat"}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <SettingsDialog customPrompt={customPrompt} onSave={onSaveCustomPrompt}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </SettingsDialog>
      </div>
    </div>
  );
} 