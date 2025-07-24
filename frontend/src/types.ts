import { Chat } from "@/app/page";

export type Suggestion = {
  original_sentence: string;
  corrected_sentence: string;
  explanation: string;
  type: "style" | "grammar";
};

export type GrammarSuggestion = {
  original: string;
  suggestion: string;
  explanation: string;
};

export type AnalysisDetail = {
  score: number;
  feedback: string;
};

export type Analysis = {
  structure: AnalysisDetail;
  clarity: AnalysisDetail;
  flow: AnalysisDetail;
  overallScore: number;
  title?: TitleAnalysis;
};

export type TitleAnalysis = AnalysisDetail & {
  title: string;
};

export type AudienceAnalysis = {
  tone: string;
  clarity: string;
  engagement: string;
};

export type CritiqueResponse = {
  original_text: string;
  suggestions: Suggestion[];
  analysis: Analysis;
  audience_analysis: AudienceAnalysis;
  model: string;
};

export type LegacyChat = Omit<Chat, 'originalText'> & {
  critiquedText: string;
};

export function isLegacyChat(chat: Chat | LegacyChat): chat is LegacyChat {
  return (chat as LegacyChat).critiquedText !== undefined;
} 