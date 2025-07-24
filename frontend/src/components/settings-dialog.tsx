"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SettingsDialogProps {
  customPrompt: string;
  onSave: (prompt: string) => void;
  children: React.ReactNode;
}

export function SettingsDialog({ customPrompt, onSave, children }: SettingsDialogProps) {
  const [prompt, setPrompt] = useState(customPrompt);

  const handleSave = () => {
    onSave(prompt);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Custom Prompt</DialogTitle>
          <DialogDescription>
            Add a custom prompt to guide the AI&apos;s critique. For example, you could ask it to act as a specific persona or to focus on a particular aspect of the writing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custom-prompt" className="text-right">
              Prompt
            </Label>
            <Textarea
              id="custom-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="col-span-3"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 