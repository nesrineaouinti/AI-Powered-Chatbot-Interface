/**
 * Chat Sidebar
 * Displays list of chats with search, filter, and actions
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Loader2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Chat } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface ChatSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const {
    chats,
    currentChat,
    createChat,
    deleteChat,
    archiveChat,
    isLoading,
  } = useChat();
  const { t, language, isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  // Filter chats
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const matchesSearch = chat.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesArchive = showArchived ? chat.is_archived : !chat.is_archived;
      return matchesSearch && matchesArchive;
    });
  }, [chats, searchQuery, showArchived]);

  // Navigation helpers
  const handleCreateNewChat = async () => {
    if (isLoading) return;
    try {
      const newChat = await createChat(language);
      if (newChat) {
        navigate(`/chatbot/${newChat.id}`);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    navigate(`/chatbot/${chat.id}`);
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatToDelete(chat);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete.id);
      if (currentChat?.id === chatToDelete.id) {
        navigate('/chatbot');
      }
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleArchiveChat = async (
    chatId: number,
    isArchived: boolean,
    e: React.MouseEvent
  ) => {
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
    <TooltipProvider delayDuration={0}>
      <div className="h-full flex flex-col border-r bg-secondary/20">
        {/* Header */}
        <div className={`p-3 border-b ${!isSidebarOpen && 'flex flex-col items-center gap-2'}`}>
          {/* MODIFICATION: Responsive New Chat Button */}
          {isSidebarOpen ? (
            <Button
              onClick={handleCreateNewChat}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('chat.newChat')}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreateNewChat}
                  variant="outline"
                  size="icon"
                  disabled={isLoading}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{t('chat.newChat')}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* MODIFICATION: Hide search and archive toggle when collapsed */}
          <div className={!isSidebarOpen ? 'hidden' : ''}>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('chat.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="w-full mt-2 justify-start"
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? t('chat.hideArchived') : t('chat.showArchived')}
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 p-2">
          {isLoading && chats.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredChats.length === 0 ? (
            isSidebarOpen && ( // MODIFICATION: Hide "no chats" message when collapsed
              <div className="text-center py-8 px-4">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {searchQuery ? t('chat.noMatching') : t('chat.noChats')}
                </p>
              </div>
            )
          ) : (
            <div className={`flex flex-col ${!isSidebarOpen && 'items-center'}`}>
              {filteredChats.map((chat) =>
                // MODIFICATION: Conditionally render compact or full chat item
                isSidebarOpen ? (
                  <ChatItemFull
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={handleSelectChat}
                    onDelete={handleDeleteChat}
                    onArchive={handleArchiveChat}
                    formatDate={formatDate}
                    t={t}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                ) : (
                  <ChatItemCompact
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => {
                      handleSelectChat(chat);
                      // Add this call to close sidebar after selection (if needed)
                      setIsSidebarOpen(false);
                    }}
                    t={t}
                    isRTL={isRTL}
                  />
                )
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              {t('chat.confirmDelete')}
            </DialogTitle>
            <DialogDescription>
              {t('chat.confirmDelete')} "{chatToDelete?.title || t('chat.untitled')}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="flex-1 sm:flex-none"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="flex-1 sm:flex-none"
            >
              {t('chat.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ChatSidebar;

const ChatItemFull = ({ chat, isActive, onSelect, onDelete, onArchive, formatDate, t }: any) => (
  <div
    onClick={() => onSelect(chat)}
    className={`group relative p-3 rounded-lg cursor-pointer transition-colors mb-1 w-full
      ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'}
      ${chat.is_archived ? 'opacity-60' : ''}
    `}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-sm truncate">{chat.title || t('chat.untitled')}</h3>
          {chat.is_archived && <Archive className="h-3 w-3 text-gray-400 flex-shrink-0" />}
        </div>
        {chat.last_message && (
          <p
            className="text-xs text-gray-500 truncate"
            title={chat.last_message.content} // Full message on hover
          >
            {chat.last_message.content.slice(0, 10)}...
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{formatDate(chat.updated_at)}</span>
          <span>• {chat.message_count} {t('chat.messages')}</span>
    
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => onArchive(chat.id, chat.is_archived, e)}>
            <Archive className="h-4 w-4 mr-2" />
            {chat.is_archived ? t('chat.unarchive') : t('chat.archive')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => onDelete(chat.id, e)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            {t('chat.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

const ChatItemCompact = ({ chat, isActive, onSelect, t, isRTL }: any) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => onSelect(chat)}
        className="h-10 w-10 mb-1"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side={isRTL ? "left" : "right"}>
      <p>{chat.title || t('chat.untitled')}</p>
    </TooltipContent>
  </Tooltip>
);