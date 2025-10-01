/**
 * Chat Sidebar
 * Displays list of chats with search and filter
 */

import React, { useState, useMemo } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Search,
  Archive,
  Trash2,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Chat } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const ChatSidebar: React.FC = () => {
  const { chats, currentChat, loadChat, deleteChat, archiveChat, isLoading } = useChat();
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Filter chats based on search and archive status
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchive = showArchived ? chat.is_archived : !chat.is_archived;
      return matchesSearch && matchesArchive;
    });
  }, [chats, searchQuery, showArchived]);

  const handleChatClick = (chat: Chat) => {
    loadChat(chat.id);
  };

  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isRTL ? 'هل أنت متأكد من حذف هذه المحادثة؟' : 'Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const handleArchiveChat = async (chatId: number, isArchived: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await archiveChat(chatId, !isArchived);
    } catch (error) {
      console.error('Failed to archive chat:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'ar' ? ar : enUS,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {isRTL ? 'المحادثات' : 'Chats'}
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={isRTL ? 'بحث...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Archive Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
          className="w-full mt-2 justify-start"
        >
          <Archive className="h-4 w-4 mr-2" />
          {showArchived
            ? (isRTL ? 'إخفاء المؤرشفة' : 'Hide Archived')
            : (isRTL ? 'عرض المؤرشفة' : 'Show Archived')}
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {isLoading && chats.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? (isRTL ? 'لا توجد محادثات مطابقة' : 'No matching chats')
                : (isRTL ? 'لا توجد محادثات بعد' : 'No chats yet')}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-colors mb-1
                  ${currentChat?.id === chat.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }
                  ${chat.is_archived ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {chat.title || (isRTL ? 'محادثة بدون عنوان' : 'Untitled Chat')}
                      </h3>
                      {chat.is_archived && (
                        <Archive className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    
                    {chat.last_message && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {chat.last_message.content}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {formatDate(chat.updated_at)}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {chat.message_count} {isRTL ? 'رسالة' : 'messages'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        chat.language === 'ar'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {chat.language.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleArchiveChat(chat.id, chat.is_archived, e)}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        {chat.is_archived
                          ? (isRTL ? 'إلغاء الأرشفة' : 'Unarchive')
                          : (isRTL ? 'أرشفة' : 'Archive')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isRTL ? 'حذف' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
