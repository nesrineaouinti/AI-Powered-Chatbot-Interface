import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Bot,
  User as UserIcon,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import type { Chat as ChatType, Message as MessageType, AIModel } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const {
    chats,
    currentChat,
    availableModels,
    isLoading,
    isSendingMessage,
    loadChat,
    createChat,
    deleteChat,
    sendMessage: sendMessageToBackend,
  } = useChat();

  const [selectedModel, setSelectedModel] = useState<AIModel>('groq');
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Auto-select first available model
  useEffect(() => {
    if (availableModels.length > 0) {
      // Select the highest priority active model
      const topModel = availableModels[0];
      setSelectedModel(topModel.name);
    }
  }, [availableModels]);

  // Get top 3 models for display (prioritize active models with API keys)
  const getDisplayModels = () => {
    if (availableModels.length > 0) {
      // Return top 3 active models
      return availableModels.slice(0, 3);
    }
    
    // Fallback: Show free/open-source models if no API keys configured
    return [
      { name: 'groq', supports_english: true, supports_arabic: true, priority: 10 },
      { name: 'other', supports_english: true, supports_arabic: true, priority: 0 },
    ];
  };

  const displayModels = getDisplayModels();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleCreateNewChat = async () => {
    if (isLoading) return;
    
    try {
      const newChat = await createChat(language);
      if (newChat) {
        console.log('Chat created successfully:', newChat);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChat || isSendingMessage) return;

    const messageContent = inputMessage;
    setInputMessage('');

    try {
      await sendMessageToBackend(currentChat.id, messageContent, language, selectedModel);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore input on error
      setInputMessage(messageContent);
    }
  };

  const handleSelectChat = async (chat: ChatType) => {
    try {
      await loadChat(chat.id);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      await deleteChat(chatId);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const groupChatsByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Safety check: ensure chats is an array
    const chatList = Array.isArray(chats) ? chats : [];
    
    console.log('Chatbot: groupChatsByDate - chats from context:', chats);
    console.log('Chatbot: chatList length:', chatList.length);

    return {
      today: chatList.filter(chat => new Date(chat.created_at) >= today),
      yesterday: chatList.filter(chat => {
        const date = new Date(chat.created_at);
        return date >= yesterday && date < today;
      }),
      lastWeek: chatList.filter(chat => {
        const date = new Date(chat.created_at);
        return date >= lastWeek && date < yesterday;
      }),
      older: chatList.filter(chat => new Date(chat.created_at) < lastWeek),
    };
  };

  const groupedChats = groupChatsByDate();
  
  console.log('Chatbot: Grouped chats:', {
    today: groupedChats.today.length,
    yesterday: groupedChats.yesterday.length,
    lastWeek: groupedChats.lastWeek.length,
    older: groupedChats.older.length,
    total: groupedChats.today.length + groupedChats.yesterday.length + groupedChats.lastWeek.length + groupedChats.older.length
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background pt-16">
      {/* Sidebar - Chat History */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 border-r bg-secondary/20 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b">
          <Button onClick={handleCreateNewChat} className="w-full" size="lg" disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {t('newChat')}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {groupedChats.today.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  {t('today')}
                </h3>
                {groupedChats.today.map(chat => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => handleSelectChat(chat)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))}
              </div>
            )}

            {groupedChats.yesterday.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  {t('yesterday')}
                </h3>
                {groupedChats.yesterday.map(chat => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => handleSelectChat(chat)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))}
              </div>
            )}

            {groupedChats.lastWeek.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  {t('lastWeek')}
                </h3>
                {groupedChats.lastWeek.map(chat => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => handleSelectChat(chat)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))}
              </div>
            )}

            {groupedChats.older.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  {t('older')}
                </h3>
                {groupedChats.older.map(chat => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => handleSelectChat(chat)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold">{t('chatbotTitle')}</h1>
          </div>

          <div className="w-64">
            <Select 
              value={selectedModel} 
              onValueChange={(value) => setSelectedModel(value as AIModel)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectModel') || 'Select AI Model'} />
              </SelectTrigger>
              <SelectContent>
                {displayModels.map((model, index) => (
                  <SelectItem key={model.name} value={model.name}>
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <span>{model.name.charAt(0).toUpperCase() + model.name.slice(1)}</span>
                      {index === 0 && availableModels.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                          Recommended
                        </span>
                      )}
                      {model.name === 'other' && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                          Free
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t('chatbotTitle') || 'AI Chatbot'}</h2>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'ابدأ محادثة جديدة مع مساعدك الذكي'
                    : 'Start a new conversation with your AI assistant'}
                </p>
              </div>
            ) : (
              <>
                {currentChat.messages.map(message => (
                  <MessageBubble key={message.id} message={message} isRTL={isRTL} language={language} />
                ))}
                {isSendingMessage && (
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 inline-block">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSendingMessage && handleSendMessage()}
              placeholder={t('typeMessage') || 'Type a message...'}
              className="flex-1"
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={!currentChat || isSendingMessage}
            />
            <Button 
              onClick={handleSendMessage} 
              size="lg"
              disabled={!currentChat || !inputMessage.trim() || isSendingMessage}
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat History Item Component
const ChatHistoryItem: React.FC<{
  chat: ChatType;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ chat, isActive, onSelect, onDelete }) => {
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <MessageSquare className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm truncate">{chat.title || 'New Chat'}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ 
  message: MessageType; 
  isRTL: boolean;
  language: string;
}> = ({ message, isRTL, language }) => {
  const isUser = message.role === 'user';

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'ar' ? ar : enUS,
      });
    } catch {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-gradient-to-br from-green-500 to-teal-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
          dir={message.language === 'ar' ? 'rtl' : 'ltr'}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
            <span>{formatTime(message.created_at)}</span>
            {!isUser && message.ai_model && (
              <>
                <span>•</span>
                <span className="capitalize">{message.ai_model}</span>
              </>
            )}
            {!isUser && message.response_time > 0 && (
              <>
                <span>•</span>
                <span>{message.response_time.toFixed(1)}s</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
