import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Bot,
  User as UserIcon,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import type { Message as MessageType, AIModel } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import ChatSidebar from '@/components/ChatSidebar';
// HELPER HOOK for detecting screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // chat id from URL
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const {
    currentChat,
    availableModels,
    isSendingMessage,
    loadChat,
    createChat,
    sendMessage: sendMessageToBackend,
  } = useChat();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [selectedModel, setSelectedModel] = useState<AIModel>('groq');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep it responsive when resizing the window
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Load chat from URL param
  useEffect(() => {
    if (id) {
      loadChat(Number(id)).catch(() => {
        console.error('Failed to load chat');
        navigate('/chatbot'); // fallback if invalid
      });
    }
  }, [id, loadChat, navigate]);

  // Auto-select first available model
  useEffect(() => {
    if (availableModels.length > 0) {
      const topModel = availableModels[0];
      setSelectedModel(topModel.name);
    }
  }, [availableModels]);

  // Get top 3 models
  const getDisplayModels = () => {
    if (availableModels.length > 0) {
      return availableModels.slice(0, 3);
    }
    return [
      { name: 'groq', supports_english: true, supports_arabic: true, priority: 10 },
      { name: 'other', supports_english: true, supports_arabic: true, priority: 0 },
    ];
  };

  const displayModels = getDisplayModels();

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);


  // Send message (auto-create chat if needed)
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSendingMessage) return;

    const messageContent = inputMessage;
    setInputMessage('');

    try {
      let chatId = currentChat?.id;

      if (!chatId) {
        const newChat = await createChat(language);
        if (!newChat) throw new Error('Failed to create new chat');
        chatId = newChat.id;
        navigate(`/chatbot/${chatId}`);
        await loadChat(chatId);
      }

      await sendMessageToBackend(chatId!, messageContent, language, selectedModel);
    } catch (error) {
      console.error('Failed to send message:', error);
      setInputMessage(messageContent);
    }
  };




  if (!user) return null;

  return (
    <div className="relative flex h-screen bg-background pt-16">

      {/* MODIFICATION: Backdrop for mobile overlay */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`
        ${isDesktop ? 'relative' : 'fixed top-16 h-[calc(100vh-4rem)] z-40 bg-background'}
        ${isSidebarOpen ? (isDesktop ? 'w-80' : 'w-72 translate-x-0') : (isDesktop ? 'w-16' : 'w-72 -translate-x-full')}
        transition-all duration-300 ease-in-out
      `}>
        <ChatSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen && !isDesktop ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>


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

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'ابدأ محادثة جديدة مع مساعدك الذكي'
                    : 'Start a new conversation with your AI assistant'}
                </p>
              </div>
            ) : (
              <>
                {currentChat.messages.map(message => (
                  <MessageBubble key={message.id} message={message} language={language} />
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

        {/* Input */}
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSendingMessage && handleSendMessage()}
              placeholder={t('chat.typeMessage') || 'Type a message...'}
              className="flex-1"
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={isSendingMessage}
            />
            <Button
              onClick={handleSendMessage}
              size="lg"
              disabled={!inputMessage.trim() || isSendingMessage}
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


// Message Bubble
const MessageBubble: React.FC<{
  message: MessageType;
  language: string;
}> = ({ message, language }) => {
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
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-br from-green-500 to-teal-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${isUser
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
