/**
 * Chat and Message Types
 * Type definitions for the chatbot system
 */

export type Language = 'en' | 'ar';
export type MessageRole = 'user' | 'assistant' | 'system';
export type AIModel = 'groq' | 'llama' | 'other';

export interface Message {
  id: number;
  chat: number;
  role: MessageRole;
  content: string;
  ai_model?: AIModel;
  language: Language;
  tokens_used: number;
  response_time: number;
  created_at: string;
}

export interface Chat {
  id: number;
  user: number;
  user_username: string;
  title: string;
  language: Language;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  message_count: number;
  last_message?: {
    content: string;
    role: MessageRole;
    created_at: string;
  };
}

export interface ChatDetail extends Chat {
  messages: Message[];
}

export interface ChatStatistics {
  total_chats: number;
  total_messages: number;
  chats_by_language: Record<Language, number>;
  messages_by_model: Record<AIModel, number>;
  average_messages_per_chat: number;
}

export interface UserSummary {
  id: number;
  user: number;
  user_username: string;
  language: Language;
  summary_text: string;
  topics: string[];
  common_queries: string[];
  chat_count: number;
  message_count: number;
  ai_model_used: AIModel;
  created_at: string;
  updated_at: string;
}

// Individual AI model info
export interface AIModelInfo {
  name: AIModel;
  is_active: boolean;
  supports_english: boolean;
  supports_arabic: boolean;
}

// API response for list of AI models
export interface AIModelListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AIModelInfo[];
}
export interface SendMessageRequest {
  content: string;
  language: Language;
  ai_model?: AIModel;
}

export interface SendMessageResponse {
  user_message: Message;
  ai_message: Message;
  model_used: AIModel;
}

export interface CreateChatRequest {
  title?: string;
  language: Language;
}

export interface GenerateSummaryRequest {
  language?: Language;
  userId : number
}

export interface GenerateSummaryResponse {
  message: string;
  summary: UserSummary;
}
