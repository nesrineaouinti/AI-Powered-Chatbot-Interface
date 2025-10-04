/**
 * Chat Service
 * Handles all chatbot-related API calls
 */

import env from '@/config/env';
import {
  Chat,
  ChatDetail,
  ChatStatistics,
  UserSummary,
  AIModelInfo,
  SendMessageRequest,
  SendMessageResponse,
  CreateChatRequest,
  GenerateSummaryRequest,
  GenerateSummaryResponse,
} from '@/types/chat';

const API_BASE_URL = `${env.apiBaseUrl}/api`;

class ChatService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(JSON.stringify(error));
    }
    return response.json();
  }

  // ==================== Chat Endpoints ====================

  /**
   * Get all chats for the authenticated user
   */
  async getChats(): Promise<Chat[]> {
    const response = await fetch(`${API_BASE_URL}/chats/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    
    // Handle paginated response
    if (data && typeof data === 'object' && 'results' in data) {
      console.log('chatService: Paginated response detected, extracting results');
      return data.results as Chat[];
    }
    
    // Handle direct array response
    return data as Chat[];
  }

  /**
   * Get a specific chat with all messages
   */
  async getChat(chatId: number): Promise<ChatDetail> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ChatDetail>(response);
  }

  /**
   * Create a new chat
   */
  async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Chat>(response);
  }

  /**
   * Update a chat (title, archive status)
   */
  async updateChat(chatId: number, data: Partial<Chat>): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Chat>(response);
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete chat' }));
      throw new Error(JSON.stringify(error));
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(chatId: number, data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/send_message/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<SendMessageResponse>(response);
  }

  /**
   * Archive or unarchive a chat
   */
  async archiveChat(chatId: number, isArchived: boolean): Promise<{ message: string; chat: Chat }> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/archive/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ is_archived: isArchived }),
    });
    return this.handleResponse<{ message: string; chat: Chat }>(response);
  }

  /**
   * Get user's chat statistics
   */
  async getStatistics(): Promise<ChatStatistics> {
    const response = await fetch(`${API_BASE_URL}/chats/statistics/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ChatStatistics>(response);
  }

  // ==================== Summary Endpoints ====================

  /**
   * Get all user summaries
   */
  async getSummaries(): Promise<UserSummary[]> {
    const response = await fetch(`${API_BASE_URL}/summaries/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserSummary[]>(response);
  }

  /**
   * Get a specific summary
   */
  async getSummary(summaryId: number): Promise<UserSummary> {
    const response = await fetch(`${API_BASE_URL}/summaries/${summaryId}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserSummary>(response);
  }

  /**
   * Generate a new AI-powered user summary
   */
  async generateSummary(data: GenerateSummaryRequest): Promise<GenerateSummaryResponse> {
    const response = await fetch(`${API_BASE_URL}/summaries/generate/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<GenerateSummaryResponse>(response);
  }

  // ==================== AI Model Endpoints ====================

  /**
   * Get available AI models
   */
  async getAIModels(): Promise<AIModelInfo[]> {
    const response = await fetch(`${API_BASE_URL}/ai-models/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  
    const data = await this.handleResponse<any>(response);
  
    // If the response is paginated, return results array
    if (data && typeof data === 'object' && 'results' in data) {
      return data.results as AIModelInfo[];
    }
  
    // Otherwise return as is
    return data as AIModelInfo[];
  }

  // ==================== Helper Methods ====================

  /**
   * Get AI models that support a specific language
   */
  async getModelsForLanguage(language: 'en' | 'ar'): Promise<AIModelInfo[]> {
    const models = await this.getAIModels();
    return models.filter(model => 
      language === 'en' ? model.supports_english : model.supports_arabic
    );
  }

  /**
   * Check if a chat exists
   */
  async chatExists(chatId: number): Promise<boolean> {
    try {
      await this.getChat(chatId);
      return true;
    } catch {
      return false;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
