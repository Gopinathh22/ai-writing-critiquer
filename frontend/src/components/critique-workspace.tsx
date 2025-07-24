"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Fuse from "fuse.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./chat-input";
import { Loading } from "./loading";
import { Chat } from "@/app/page";
import { Suggestion, Analysis, AudienceAnalysis, LegacyChat, isLegacyChat } from "@/types";
import { AnalysisDashboard } from "./analysis-dashboard";
import { AudienceAnalysisCard } from "./audience-analysis-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CritiqueWorkspaceProps {
  chat: Chat | LegacyChat;
  onSave: (chat: Chat) => void;
  customPrompt: string;
}

export function CritiqueWorkspace({ chat, onSave, customPrompt }: CritiqueWorkspaceProps) {
  const [text, setText] = useState(chat.text);
  const [title, setTitle] = useState(chat.title);
  const [model, setModel] = useState(chat.model);
  const [audience, setAudience] = useState(chat.audience);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(chat.suggestions);
  const [analysis, setAnalysis] = useState<Analysis | null>(chat.analysis);
  const [audienceAnalysis, setAudienceAnalysis] = useState<AudienceAnalysis | null>(chat.audience_analysis);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalText, setOriginalText] = useState(isLegacyChat(chat) ? chat.critiquedText : chat.originalText);

  const handleCritique = async (text: string, model: string, audience: string) => {
    setIsLoading(true);
    setError("");
    setSuggestions([]);
    setAnalysis(null);
    setAudienceAnalysis(null);
    setText(text);
    setModel(model);
    setAudience(audience);
    setOriginalText(text);

    try {
      const response = await fetch("http://localhost:8000/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model, customPrompt, audience }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to get critiques. Please check the backend server.");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setAnalysis(data.analysis);
      setAudienceAnalysis(data.audience_analysis);
      setOriginalText(data.original_text);
      setModel(data.model);

      let newTitle = title;
      if (data.analysis?.title?.title) {
        newTitle = data.analysis.title.title;
        setTitle(newTitle);
      } else if (title === "New Chat") {
        newTitle = text.substring(0, 30) + "...";
        setTitle(newTitle);
      }

      onSave({ 
        ...chat,
        id: chat.id,
        text, 
        title: newTitle, 
        model, 
        audience, 
        suggestions: data.suggestions, 
        analysis: data.analysis, 
        audience_analysis: data.audience_analysis,
        originalText: data.original_text
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderCritiquedText = (): React.ReactNode => {
    if (isLoading) return <Loading />;

    if (!originalText) {
        return <div className="prose dark:prose-invert max-w-none" />;
    }

    if (suggestions.length === 0) {
      return <div className="prose dark:prose-invert max-w-none"><ReactMarkdown>{originalText || "Your critiqued text will appear here..."}</ReactMarkdown></div>;
    }

    const suggestionMap = suggestions.reduce((acc, s) => {
      if (!acc[s.original_sentence]) {
        acc[s.original_sentence] = [];
      }
      acc[s.original_sentence].push(s);
      return acc;
    }, {} as Record<string, Suggestion[]>);

    const sentences = originalText.split(/(?<=[.!?])\s+/);
    const fuse = new Fuse<string>(sentences, { includeScore: true, threshold: 0.1 });

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    Object.keys(suggestionMap).forEach((sentenceWithSuggestion, i) => {
      const results = fuse.search(sentenceWithSuggestion);
      if (results.length > 0) {
        const bestMatch = results[0];
        const sentence = bestMatch.item;
        
        const startIndex = originalText.indexOf(sentence, lastIndex);
        if (startIndex !== -1) {
          const endIndex = startIndex + sentence.length;
          
          if (startIndex > lastIndex) {
            parts.push(<ReactMarkdown key={`text-${lastIndex}`}>{originalText.substring(lastIndex, startIndex)}</ReactMarkdown>);
          }
          
          const suggestionsForSentence = suggestionMap[sentenceWithSuggestion];
          let content: React.ReactNode = sentence;
          const hasStyle = suggestionsForSentence.some(s => s.type === 'style');
          const hasGrammar = suggestionsForSentence.some(s => s.type === 'grammar');
  
          if (hasStyle && hasGrammar) {
            content = <span className="bg-gradient-to-r from-yellow-200 to-blue-200 dark:from-yellow-800 dark:to-blue-800 rounded px-1">{content}</span>;
          } else if (hasStyle) {
            content = <span className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">{content}</span>;
          } else if (hasGrammar) {
            content = <span className="bg-blue-200 dark:bg-blue-800 rounded px-1">{content}</span>;
          }
  
          parts.push(
            <Popover key={`suggestion-${i}`}>
              <PopoverTrigger asChild>
                <span className="cursor-pointer">{content}</span>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-96 overflow-y-auto">
                  {suggestionsForSentence.map((suggestion, j) => (
                    <div key={j} className={j > 0 ? "mt-4 border-t pt-4" : ""}>
                      <p className="font-semibold">Suggestion ({suggestion.type}):</p>
                      <div className="prose prose-sm dark:prose-invert max-w-none my-2">
                        <ReactMarkdown>{suggestion.corrected_sentence}</ReactMarkdown>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Explanation:</strong> {suggestion.explanation}
                      </p>
                    </div>
                  ))}
              </PopoverContent>
            </Popover>
          );
          
          lastIndex = endIndex;
        }
      }
    });
  
    if (lastIndex < originalText.length) {
      parts.push(<ReactMarkdown key={`text-${lastIndex}`}>{originalText.substring(lastIndex)}</ReactMarkdown>);
    }
  
    return <div className="prose dark:prose-invert max-w-none">{parts}</div>;
  };
  
    const hasCritique = suggestions.length > 0;

  return (
    <ScrollArea className="h-full">
      {hasCritique || isLoading ? (
        <div className="p-4 md:p-6 h-full flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <Input 
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Chat title"
              className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0"
            />
          </div>
          <div className="grid lg:grid-cols-3 gap-8 flex-1">
            <div className="lg:col-span-2">
              <div className="text-sm text-muted-foreground mb-4">
                <span className="font-bold">Analyzed with {model.charAt(0).toUpperCase() + model.slice(1)}</span>
                {audience && (
                  <>
                    {" "}
                    | Audience: <span className="font-medium">{audience}</span>
                  </>
                )}
              </div>
              
              <Card className="h-full">
                <CardContent className="pt-6 h-full">
                  {renderCritiquedText()}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-4 flex flex-col">
              <Tabs defaultValue="analysis" className="flex flex-col flex-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                </TabsList>
                <TabsContent value="analysis" className="flex-1">
                  {analysis && <AnalysisDashboard analysis={analysis} />}
                </TabsContent>
                <TabsContent value="audience" className="flex-1">
                  {audienceAnalysis && <AudienceAnalysisCard audienceAnalysis={audienceAnalysis} />}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          {error && (
            <div className="mt-4">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1" />
          <div className="p-4">
            <ChatInput onCritique={handleCritique} isLoading={isLoading} />
          </div>
        </div>
      )}
    </ScrollArea>
  );
} 