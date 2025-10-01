/**
 * Chat Page
 * Main chat interface with sidebar and message area
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatSidebar from '@/components/ChatSidebar';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import { PlusCircle, Menu, X } from 'lucide-react';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentChat, createChat, isLoading } = useChat();
  const { language, isRTL, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      await createChat(language);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
          fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-30
          w-80 bg-white dark:bg-gray-800 border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
        `}
      >
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentChat?.title || t('chat.newChat')}
            </h1>
          </div>

          <Button
            onClick={handleCreateChat}
            disabled={isCreatingChat || isLoading}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {t('chat.newChat')}
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {currentChat ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <ChatMessages />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <ChatInput />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('chat.emptyState.title')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {t('chat.emptyState.description')}
                </p>
                <Button
                  onClick={handleCreateChat}
                  disabled={isCreatingChat || isLoading}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  {t('chat.createChat')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Chat;
