"use client";

import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generating critique...</p>
      </div>
    </div>
  );
} 