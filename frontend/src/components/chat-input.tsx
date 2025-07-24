"use client";

import Textarea from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onCritique: (text: string, model: string, audience: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onCritique, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState("google");
  const [audience, setAudience] = useState("Young Entrepreneur");

  const handleCritique = () => {
    onCritique(text, model, audience);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing..."
            className="w-full resize-none rounded-2xl border border-input bg-background p-4 pr-20 shadow-sm min-h-[60px]"
            minRows={1}
            maxRows={10}
          />
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-2">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Gemini</SelectItem>
                <SelectItem value="anthropic">Claude</SelectItem>
                <SelectItem value="openai">GPT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select an audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Young Entrepreneur">Young Entrepreneur</SelectItem>
                <SelectItem value="University Student">University Student</SelectItem>
                <SelectItem value="General Public">General Public</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              onClick={handleCritique}
              disabled={isLoading || !text}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 