/**
 * Unit tests for chatService
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { chatService } from '../chatService'
import { mockChat, mockChatDetail, mockMessage, mockStatistics, mockUserSummary } from '@/test/mockData'

// Mock fetch globally
global.fetch = vi.fn()

describe('ChatService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    ;(localStorage.getItem as any).mockReturnValue('mock-access-token')
  })

  describe('getChats', () => {
    it('should get all chats', async () => {
      const mockChats = [mockChat]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChats,
      })

      const result = await chatService.getChats()

      expect(result).toEqual(mockChats)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-access-token',
          }),
        })
      )
    })

    it('should handle paginated response', async () => {
      const paginatedResponse = {
        results: [mockChat],
        count: 1,
        next: null,
        previous: null,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => paginatedResponse,
      })

      const result = await chatService.getChats()

      expect(result).toEqual([mockChat])
    })
  })

  describe('getChat', () => {
    it('should get a specific chat with messages', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChatDetail,
      })

      const result = await chatService.getChat(1)

      expect(result).toEqual(mockChatDetail)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1/'),
        expect.any(Object)
      )
    })
  })

  describe('createChat', () => {
    it('should create a new chat', async () => {
      const newChatData = {
        title: 'New Chat',
        language: 'en' as const,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChat,
      })

      const result = await chatService.createChat(newChatData)

      expect(result).toEqual(mockChat)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newChatData),
        })
      )
    })
  })

  describe('updateChat', () => {
    it('should update a chat', async () => {
      const updates = { title: 'Updated Title' }
      const updatedChat = { ...mockChat, ...updates }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedChat,
      })

      const result = await chatService.updateChat(1, updates)

      expect(result).toEqual(updatedChat)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1/'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      )
    })
  })

  describe('deleteChat', () => {
    it('should delete a chat', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await chatService.deleteChat(1)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1/'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    it('should throw error on failed delete', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Not found' }),
      })

      await expect(chatService.deleteChat(1)).rejects.toThrow()
    })
  })

  describe('sendMessage', () => {
    it('should send a message and get AI response', async () => {
      const messageData = {
        content: 'Hello, AI!',
        language: 'en' as const,
      }

      const mockResponse = {
        user_message: mockMessage,
        ai_message: { ...mockMessage, role: 'assistant' as const, content: 'AI response' },
        model_used: 'groq',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await chatService.sendMessage(1, messageData)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1/send_message/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(messageData),
        })
      )
    })
  })

  describe('archiveChat', () => {
    it('should archive a chat', async () => {
      const mockResponse = {
        message: 'Chat archived',
        chat: { ...mockChat, is_archived: true },
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await chatService.archiveChat(1, true)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1/archive/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ is_archived: true }),
        })
      )
    })
  })

  describe('getStatistics', () => {
    it('should get chat statistics', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatistics,
      })

      const result = await chatService.getStatistics()

      expect(result).toEqual(mockStatistics)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/statistics/'),
        expect.any(Object)
      )
    })
  })

  describe('getSummaries', () => {
    it('should get all user summaries', async () => {
      const mockSummaries = [mockUserSummary]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummaries,
      })

      const result = await chatService.getSummaries()

      expect(result).toEqual(mockSummaries)
    })
  })

  describe('getSummary', () => {
    it('should get a specific summary', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserSummary,
      })

      const result = await chatService.getSummary(1)

      expect(result).toEqual(mockUserSummary)
    })
  })

  describe('generateSummary', () => {
    it('should generate a new summary', async () => {
      const summaryData = { language: 'en' as const, userId: 1 }
      const mockResponse = {
        message: 'Summary generated successfully',
        summary: mockUserSummary,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await chatService.generateSummary(summaryData)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/summaries/generate/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(summaryData),
        })
      )
    })
  })

  describe('getAIModels', () => {
    it('should get available AI models', async () => {
      const mockModels = [
        {
          name: 'groq',
          is_active: true,
          supports_english: true,
          supports_arabic: true,
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockModels,
      })

      const result = await chatService.getAIModels()

      expect(result).toEqual(mockModels)
    })
  })

  describe('getModelsForLanguage', () => {
    it('should filter models by language support', async () => {
      const mockModels = [
        {
          name: 'groq',
          is_active: true,
          supports_english: true,
          supports_arabic: true,
        },
        {
          name: 'llama',
          is_active: true,
          supports_english: true,
          supports_arabic: false,
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockModels,
      })

      const result = await chatService.getModelsForLanguage('ar')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('groq')
    })
  })

  describe('chatExists', () => {
    it('should return true if chat exists', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChatDetail,
      })

      const result = await chatService.chatExists(1)

      expect(result).toBe(true)
    })

    it('should return false if chat does not exist', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Not found' }),
      })

      const result = await chatService.chatExists(999)

      expect(result).toBe(false)
    })
  })
})
