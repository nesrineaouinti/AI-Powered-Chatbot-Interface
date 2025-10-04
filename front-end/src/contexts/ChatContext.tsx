/**
 * Chat Context
 * Global state management for chatbot functionality
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '@/services/chatService';
import {
  Chat,
  ChatDetail,
  SendMessageRequest,
  CreateChatRequest,
  Language,
  AIModelInfo,
} from '@/types/chat';

interface ChatContextType {
  // State
  chats: Chat[];
  currentChat: ChatDetail | null;
  availableModels: AIModelInfo[];
  isLoading: boolean;
  error: string | null;
  isSendingMessage: boolean;

  // Chat operations
  loadChats: () => Promise<void>;
  loadChat: (chatId: number) => Promise<ChatDetail | null>;
  createChat: (language: Language, title?: string) => Promise<Chat | null>;
  deleteChat: (chatId: number) => Promise<void>;
  archiveChat: (chatId: number, isArchived: boolean) => Promise<void>;

  // Message operations
  sendMessage: (chatId: number, content: string, language: Language, aiModel?: string) => Promise<void>;

  // AI Models
  loadAIModels: () => Promise<void>;

  // Utilities
  clearError: () => void;
  setCurrentChat: (chat: ChatDetail | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatDetail | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Debug: Log chats state changes
  useEffect(() => {
    console.log('ChatContext: chats state changed:', chats);
    console.log('ChatContext: chats length:', chats?.length);
  }, [chats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadChats = useCallback(async () => {
    console.log('loadChats: Starting to load chats');
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getChats();
      console.log('loadChats: Successfully loaded chats:', data);
      console.log('loadChats: Number of chats:', data?.length);
      console.log('loadChats: Is array?', Array.isArray(data));
      setChats(data);
      console.log('loadChats: State updated with chats');
    } catch (err: any) {
      console.error('Failed to load chats:', err);
      console.error('Error details:', err.message);
      setError('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadChat = useCallback(async (chatId: number): Promise<ChatDetail | null> => {
    if (!chatId) {
      console.error('loadChat called with invalid chatId:', chatId);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getChat(chatId);
      setCurrentChat(data);
      return data; // ✅ return the chat so the caller can use it
    } catch (err: any) {
      console.error('Failed to load chat:', err);
      setError('Failed to load chat');
      setCurrentChat(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createChat = useCallback(async (language: Language, title?: string): Promise<Chat | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const data: CreateChatRequest = { language, title };
      const newChat = await chatService.createChat(data);

      console.log('Chat created:', newChat);

      // Validate chat has an ID
      if (!newChat || !newChat.id) {
        throw new Error('Invalid chat response: missing ID');
      }

      // Add to chats list
      setChats(prev => [newChat, ...(Array.isArray(prev) ? prev : [])]);

      // Load the new chat with messages
      await loadChat(newChat.id);

      return newChat;
    } catch (err: any) {
      console.error('Failed to create chat:', err);
      setError('Failed to create chat');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadChat]);

  const deleteChat = useCallback(async (chatId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await chatService.deleteChat(chatId);

      // Remove from chats list
      setChats(prev => (Array.isArray(prev) ? prev : []).filter(chat => chat.id !== chatId));

      // Clear current chat if it was deleted
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (err: any) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentChat]);

  const archiveChat = useCallback(async (chatId: number, isArchived: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatService.archiveChat(chatId, isArchived);

      // Update chats list
      setChats(prev => (Array.isArray(prev) ? prev : []).map(chat =>
        chat.id === chatId ? result.chat : chat
      ));

      // Update current chat if it's the one being archived
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => prev ? { ...prev, is_archived: isArchived } : null);
      }
    } catch (err: any) {
      console.error('Failed to archive chat:', err);
      setError('Failed to archive chat');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentChat]);

  const sendMessage = useCallback(async (
    chatId: number,
    content: string,
    language: Language,
    aiModel?: string
  ) => {
    setIsSendingMessage(true);
    setError(null);

    try {
      const data: SendMessageRequest = {
        content,
        language,
        ...(aiModel && { ai_model: aiModel as any }),
      };

      await chatService.sendMessage(chatId, data);

      // ✅ Always reload the chat from the backend (to get updated messages)
      const updatedChat = await chatService.getChat(chatId);
      setCurrentChat(updatedChat);
      // Update chat in the sidebar list
      // ✅ Also update the sidebar chat list
      setChats(prev =>
        (Array.isArray(prev) ? prev : []).map(chat =>
          chat.id === chatId
            ? {
              ...chat,
              message_count: updatedChat.message_count,
              updated_at: updatedChat.updated_at,
              last_message: updatedChat.last_message,
              title: updatedChat.title || chat.title,
            }
            : chat
        )
      );

    } catch (err: any) {
      console.error('Failed to send message:', err);

      // Parse error message
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.error || errorData.detail || 'Failed to send message');
      } catch {
        setError('Failed to send message');
      }

      throw err;
    } finally {
      setIsSendingMessage(false);
    }
  }, [currentChat]);

  const loadAIModels = useCallback(async () => {
    try {
      const models: AIModelInfo[] = await chatService.getAIModels(); // already returns array
      setAvailableModels(models); // directly store it
    } catch (err: any) {
      console.error('Failed to load AI models:', err);
    }
  }, []);

  // Load chats when user logs in
  useEffect(() => {
    console.log('ChatContext useEffect triggered, user:', user?.username);
    if (user) {
      console.log('User authenticated, loading chats and models');
      loadChats();
      loadAIModels();
    } else {
      console.log('No user, clearing state');
      // Clear state when user logs out
      setChats([]);
      setCurrentChat(null);
      setAvailableModels([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value: ChatContextType = {
    chats,
    currentChat,
    availableModels,
    isLoading,
    error,
    isSendingMessage,
    loadChats,
    loadChat,
    createChat,
    deleteChat,
    archiveChat,
    sendMessage,
    loadAIModels,
    clearError,
    setCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
