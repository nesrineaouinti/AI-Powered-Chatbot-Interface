/**
 * Chat Messages
 * Displays chat messages with auto-scroll and typing indicator
 */

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Message } from '@/types/chat';
import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const ChatMessages: React.FC = () => {
  const { currentChat, isSendingMessage } = useChat();
  const { language, isRTL } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isSendingMessage]);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'ar' ? ar : enUS,
      });
    } catch {
      return dateString;
    }
  };

  if (!currentChat) {
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      {currentChat.messages.length === 0 && !isSendingMessage ? (
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {isRTL
              ? 'ابدأ المحادثة بإرسال رسالة'
              : 'Start the conversation by sending a message'}
          </p>
        </div>
      ) : (
        <>
          {currentChat.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              formatTime={formatTime}
              isRTL={isRTL}
            />
          ))}

          {/* Typing Indicator */}
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

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  formatTime: (dateString: string) => string;
  isRTL: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, formatTime, isRTL }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : '')}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-green-500 to-teal-600'
            : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? (isRTL ? 'text-left' : 'text-right') : (isRTL ? 'text-right' : 'text-left')}`}>
        <div className={`inline-block max-w-[80%] ${isUser ? (isRTL ? 'text-left' : 'text-right') : (isRTL ? 'text-right' : 'text-left')}`}>
          {/* Message Bubble */}
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
            dir={message.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Metadata */}
          <div className={`flex items-center gap-2 mt-1 px-2 text-xs text-gray-500 dark:text-gray-400 ${
            isUser ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')
          }`}>
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
            {message.language && (
              <>
                <span>•</span>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  message.language === 'ar'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {message.language.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
