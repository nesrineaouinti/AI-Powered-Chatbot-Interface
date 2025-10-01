/**
 * Chat Input
 * Message input with AI model selector and language toggle
 */

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Loader2, Bot } from 'lucide-react';
import { Language, AIModel } from '@/types/chat';

const ChatInput: React.FC = () => {
  const { currentChat, sendMessage, isSendingMessage, availableModels } = useChat();
  const { language: userLanguage, t } = useLanguage();
  
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(userLanguage);
  const [selectedModel, setSelectedModel] = useState<AIModel | ''>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update selected language when user language changes
  useEffect(() => {
    setSelectedLanguage(userLanguage);
  }, [userLanguage]);

  // Update selected language when chat changes
  useEffect(() => {
    if (currentChat) {
      setSelectedLanguage(currentChat.language);
    }
  }, [currentChat]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChat || isSendingMessage) {
      return;
    }

    try {
      await sendMessage(
        currentChat.id,
        message.trim(),
        selectedLanguage,
        selectedModel || undefined
      );
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Filter models by selected language
  const filteredModels = availableModels.filter(model =>
    selectedLanguage === 'ar' ? model.supports_arabic : model.supports_english
  );

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Options Bar */}
        <div className="flex items-center gap-2 mb-3">
          {/* Language Selector */}
          <Select
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as Language)}
            disabled={isSendingMessage}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <span className="flex items-center gap-2">
                  🇬🇧 English
                </span>
              </SelectItem>
              <SelectItem value="ar">
                <span className="flex items-center gap-2">
                  🇸🇦 العربية
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* AI Model Selector */}
          {filteredModels.length > 0 && (
            <Select
              value={selectedModel}
              onValueChange={(value) => setSelectedModel(value as AIModel)}
              disabled={isSendingMessage}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('chatbot.selectModel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('common.loading')}
                </SelectItem>
                {filteredModels.map((model) => (
                  <SelectItem key={model.name} value={model.name}>
                    <span className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      {model.name.charAt(0).toUpperCase() + model.name.slice(1)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex-1" />

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('chat.send')}
          </span>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.typeMessage')}
              disabled={isSendingMessage}
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {message.length}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!message.trim() || isSendingMessage}
            size="lg"
            className="h-[60px] px-6"
          >
            {isSendingMessage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {t('errors.validation')}
        </p>
      </div>
    </form>
  );
};

export default ChatInput;
