import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
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
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
}

const Chatbot: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [inputMessage, setInputMessage] = useState('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a default chat
  useEffect(() => {
    if (chatHistory.length === 0) {
      createNewChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: t('newChat'),
      messages: [],
      model: selectedModel,
      createdAt: new Date(),
    };
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChat(newChat);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    // Update current chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? inputMessage.substring(0, 30) + '...' : currentChat.title,
    };

    setCurrentChat(updatedChat);
    setInputMessage('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(inputMessage, selectedModel),
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
      };

      setCurrentChat(finalChat);
      updateChatInHistory(finalChat);
    }, 1000);
  };

  const generateMockResponse = (query: string, model: string): string => {
    const responses = {
      'gpt-4': `This is a response from GPT-4. You asked: "${query}". GPT-4 is the most capable model with advanced reasoning abilities.`,
      'gpt-3.5': `This is a response from GPT-3.5. You asked: "${query}". GPT-3.5 offers a good balance between capability and speed.`,
      'claude': `This is a response from Claude. You asked: "${query}". Claude excels at creative and nuanced conversations.`,
    };
    return responses[model as keyof typeof responses] || responses['gpt-4'];
  };

  const updateChatInHistory = (updatedChat: Chat) => {
    setChatHistory(chatHistory.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    setSelectedModel(chat.model);
  };

  const deleteChat = (chatId: string) => {
    const newHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(newHistory);
    if (currentChat?.id === chatId) {
      setCurrentChat(newHistory[0] || null);
    }
  };

  const groupChatsByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    return {
      today: chatHistory.filter(chat => new Date(chat.createdAt) >= today),
      yesterday: chatHistory.filter(chat => {
        const date = new Date(chat.createdAt);
        return date >= yesterday && date < today;
      }),
      lastWeek: chatHistory.filter(chat => {
        const date = new Date(chat.createdAt);
        return date >= lastWeek && date < yesterday;
      }),
      older: chatHistory.filter(chat => new Date(chat.createdAt) < lastWeek),
    };
  };

  const groupedChats = groupChatsByDate();

  return (
    <div className="flex h-screen bg-background pt-16">
      {/* Sidebar - Chat History */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 border-r bg-secondary/20 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b">
          <Button onClick={createNewChat} className="w-full" size="lg">
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
                    onSelect={() => selectChat(chat)}
                    onDelete={() => deleteChat(chat.id)}
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
                    onSelect={() => selectChat(chat)}
                    onDelete={() => deleteChat(chat.id)}
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
                    onSelect={() => selectChat(chat)}
                    onDelete={() => deleteChat(chat.id)}
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
                    onSelect={() => selectChat(chat)}
                    onDelete={() => deleteChat(chat.id)}
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
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectModel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">{t('gpt4')}</SelectItem>
                <SelectItem value="gpt-3.5">{t('gpt35')}</SelectItem>
                <SelectItem value="claude">{t('claude')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {currentChat?.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t('chatbotTitle')}</h2>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'ابدأ محادثة جديدة مع مساعدك الذكي'
                    : 'Start a new conversation with your AI assistant'}
                </p>
              </div>
            ) : (
              currentChat?.messages.map(message => (
                <MessageBubble key={message.id} message={message} isRTL={isRTL} />
              ))
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('typeMessage')}
              className="flex-1"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <Button onClick={sendMessage} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat History Item Component
const ChatHistoryItem: React.FC<{
  chat: Chat;
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
        <span className="text-sm truncate">{chat.title}</span>
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
const MessageBubble: React.FC<{ message: Message; isRTL: boolean }> = ({ message, isRTL }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-foreground" />
          )}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
