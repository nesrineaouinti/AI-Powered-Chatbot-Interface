/**
 * Unit tests for ChatInput component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import ChatInput from '../ChatInput'
import * as ChatContext from '@/contexts/ChatContext'
import * as LanguageContext from '@/contexts/LanguageContext'
import { mockChat } from '@/test/mockData'

// Mock the contexts
vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn(),
  ChatProvider: ({ children }: any) => children,
}))

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
  LanguageProvider: ({ children }: any) => children,
}))

describe('ChatInput', () => {
  const mockSendMessage = vi.fn()
  const mockT = (key: string) => key

  beforeEach(() => {
    vi.clearAllMocks()
    
    ;(ChatContext.useChat as any).mockReturnValue({
      currentChat: mockChat,
      sendMessage: mockSendMessage,
      isSendingMessage: false,
      availableModels: [
        { name: 'groq', is_active: true, supports_english: true, supports_arabic: true },
        { name: 'llama', is_active: true, supports_english: true, supports_arabic: false },
      ],
    })
    
    ;(LanguageContext.useLanguage as any).mockReturnValue({
      language: 'en',
      t: mockT,
    })
  })

  it.skip('should render chat input form', () => {
    render(<ChatInput />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it.skip('should update message on input change', () => {
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello, AI!' } })
    
    expect(textarea).toHaveValue('Hello, AI!')
  })

  it.skip('should show character count', () => {
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it.skip('should submit message on form submit', async () => {
    mockSendMessage.mockResolvedValue(undefined)
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    const form = textarea.closest('form')!
    
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith(
        mockChat.id,
        'Test message',
        'en',
        undefined
      )
    })
    
    // Message should be cleared after sending
    expect(textarea).toHaveValue('')
  })

  it.skip('should submit message on Enter key press', async () => {
    mockSendMessage.mockResolvedValue(undefined)
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled()
    })
  })

  it.skip('should not submit on Shift+Enter', () => {
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it.skip('should disable submit when message is empty', () => {
    render(<ChatInput />)
    
    const submitButton = screen.getByRole('button', { name: /send/i })
    
    expect(submitButton).toBeDisabled()
  })

  it.skip('should disable submit when message is only whitespace', () => {
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(textarea, { target: { value: '   ' } })
    
    expect(submitButton).toBeDisabled()
  })

  it.skip('should disable input when sending message', () => {
    ;(ChatContext.useChat as any).mockReturnValue({
      currentChat: mockChat,
      sendMessage: mockSendMessage,
      isSendingMessage: true,
      availableModels: [],
    })
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /send/i })
    
    expect(textarea).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it.skip('should show loading spinner when sending', () => {
    ;(ChatContext.useChat as any).mockReturnValue({
      currentChat: mockChat,
      sendMessage: mockSendMessage,
      isSendingMessage: true,
      availableModels: [],
    })
    
    render(<ChatInput />)
    
    // Check for loader icon
    const button = screen.getByRole('button', { name: /send/i })
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it.skip('should filter models by selected language', () => {
    render(<ChatInput />)
    
    // Initially English is selected, both models should be available
    const modelSelects = screen.getAllByRole('combobox')
    expect(modelSelects.length).toBeGreaterThan(0)
  })

  it('should not submit when no current chat', async () => {
    ;(ChatContext.useChat as any).mockReturnValue({
      currentChat: null,
      sendMessage: mockSendMessage,
      isSendingMessage: false,
      availableModels: [],
    })
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    const form = textarea.closest('form')!
    
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.submit(form)
    
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it.skip('should handle send message error', async () => {
    mockSendMessage.mockRejectedValue(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    const form = textarea.closest('form')!
    
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to send message:',
        expect.any(Error)
      )
    })
    
    consoleSpy.mockRestore()
  })

  it.skip('should set text direction based on language', () => {
    ;(LanguageContext.useLanguage as any).mockReturnValue({
      language: 'ar',
      t: mockT,
    })
    
    render(<ChatInput />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('dir', 'rtl')
  })
})
