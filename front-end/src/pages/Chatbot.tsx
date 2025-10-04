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
import { Send, Bot, User as UserIcon, Menu, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import ChatSidebar from '@/components/ChatSidebar';
import type { Message as MessageType, AIModel } from '@/types/chat';

// Hook to detect screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const {
    currentChat,
    availableModels,
    isSendingMessage,
    loadChat,
    createChat,
    sendMessage,
    setCurrentChat,
  } = useChat();

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [selectedModel, setSelectedModel] = useState<AIModel>('groq');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Responsive sidebar
  useEffect(() => setIsSidebarOpen(isDesktop), [isDesktop]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) navigate('/signin');
  }, [user, navigate]);

  // Load chat if ID exists, otherwise clear
  useEffect(() => {
    if (!id) {
      setCurrentChat(null); // base /chatbot page
    } else {
      loadChat(Number(id)).catch(() => {
        console.error('Failed to load chat');
        navigate('/chatbot');
      });
    }
  }, [id, loadChat, setCurrentChat, navigate]);

  // Auto-select first model
  useEffect(() => {
    if (availableModels?.length > 0) setSelectedModel(availableModels[0].name);
  }, [availableModels]);

  console.log("availableModels",availableModels)
  // Scroll to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [currentChat?.messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSendingMessage || isCreatingChat) return;
  
    const userMessage = inputMessage.trim();
    setInputMessage('');
  
    if (currentChat) {
      const tempMessage: MessageType = {
        id: -Date.now(), 
        chat: currentChat.id,
        role: 'user',
        content: userMessage,
        language: language,
        tokens_used: 0,
        response_time: 0,
        created_at: new Date().toISOString(),
      };
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, tempMessage]
      };
      setCurrentChat(updatedChat);
    }
  
    try {
      let chatId = currentChat?.id;
  
      if (!chatId) {
        setIsCreatingChat(true);
        const newChat = await createChat(language);
  
        if (!newChat) throw new Error('Chat creation failed');
  
        chatId = newChat.id;
  
        navigate(`/chatbot/${chatId}`);
      }
  
      await sendMessage(chatId!, userMessage, language, selectedModel);
  

      const updatedChat = await loadChat(chatId!);
      if (updatedChat) setCurrentChat(updatedChat);
  
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsCreatingChat(false);
    }
  };
  
  

  if (!user) return null;

  return (
    <div className="relative flex h-screen bg-background pt-16">
      {/* Mobile backdrop */}
      {!isDesktop && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isDesktop ? 'relative' : 'fixed top-16 h-[calc(100vh-4rem)] z-40 bg-background'}
          ${isSidebarOpen ? (isDesktop ? 'w-80' : 'w-72 translate-x-0') : isDesktop ? 'w-16' : isRTL ? 'translate-x-full w-72 right-0' : '-translate-x-full w-72 left-0'}
          ${isRTL ? (isDesktop ? 'right-0' : 'right-0') : (isDesktop ? 'left-0' : 'left-0')}
          transition-all duration-300 ease-in-out
        `}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <ChatSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen && !isDesktop ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="w-64">
            <Select value={selectedModel} onValueChange={v => setSelectedModel(v as AIModel)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectModel') || 'Select AI Model'} />
              </SelectTrigger>
              <SelectContent>
                {availableModels && availableModels?.map((model, idx) => (
                  <SelectItem key={model.name} value={model.name}>
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <span>{model.name.charAt(0).toUpperCase() + model.name.slice(1)}</span>
                      {idx === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Recommended</span>
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
            {!currentChat || currentChat.messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <p className="text-muted-foreground">{t('chat.emptyState.title')}</p>
              </div>
            ) : (
              <>
                {currentChat.messages?.map(msg => (
                  <MessageBubble key={msg.id} message={msg} language={language} />
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
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isSendingMessage && handleSendMessage()}
              placeholder={t('chat.typeMessage') || 'Type a message...'}
              className="flex-1"
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={isSendingMessage}
            />
            <Button onClick={handleSendMessage} size="lg" disabled={!inputMessage.trim() || isSendingMessage}>
              {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: MessageType; language: string }> = ({ message, language }) => {
  const isUser = message.role === 'user';
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: language === 'ar' ? ar : enUS });
    } catch {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-br from-green-500 to-teal-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}>
          {isUser ? <UserIcon className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
        </div>
        <div className={`rounded-2xl px-4 py-3 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`} dir={message.language === 'ar' ? 'rtl' : 'ltr'}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
            <span>{formatTime(message.created_at)}</span>
            {!isUser && message.ai_model && <>
              <span>•</span>
              <span className="capitalize">{message.ai_model}</span>
            </>}
            {!isUser && message.response_time > 0 && <>
              <span>•</span>
              <span>{message.response_time.toFixed(1)}s</span>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
