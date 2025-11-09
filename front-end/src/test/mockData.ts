/**
 * Mock data for testing
 */

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  language_preference: 'en',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockChat = {
  id: 1,
  user: 1,
  user_username: 'testuser',
  title: 'Test Chat',
  language: 'en',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  is_archived: false,
  message_count: 2,
  last_message: {
    content: 'Last message content',
    role: 'assistant',
    created_at: '2024-01-01T00:00:00Z',
  },
}

export const mockMessage = {
  id: 1,
  chat: 1,
  role: 'user',
  content: 'Hello, AI!',
  ai_model: null,
  language: 'en',
  tokens_used: 0,
  response_time: 0,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockAIMessage = {
  id: 2,
  chat: 1,
  role: 'assistant',
  content: 'Hello! How can I help you today?',
  ai_model: 'groq',
  language: 'en',
  tokens_used: 50,
  response_time: 1.5,
  created_at: '2024-01-01T00:00:01Z',
}

export const mockChatDetail = {
  ...mockChat,
  messages: [mockMessage, mockAIMessage],
}

export const mockUserSummary = {
  id: 1,
  user: 1,
  user_username: 'testuser',
  language: 'en',
  summary_text: 'User is interested in AI and programming',
  topics: ['AI', 'Programming', 'Python'],
  common_queries: ['How to use AI?', 'Python tutorials'],
  chat_count: 10,
  message_count: 50,
  ai_model_used: 'groq',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockStatistics = {
  total_chats: 10,
  total_messages: 50,
  chats_by_language: { en: 7, ar: 3 },
  messages_by_model: { groq: 30, llama: 20 },
  average_messages_per_chat: 5.0,
}

export const mockAuthTokens = {
  access: 'mock-access-token',
  refresh: 'mock-refresh-token',
}
