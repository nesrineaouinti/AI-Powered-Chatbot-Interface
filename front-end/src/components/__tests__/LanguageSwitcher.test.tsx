/**
 * Unit tests for LanguageSwitcher component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import LanguageSwitcher from '../LanguageSwitcher'
import * as LanguageContext from '@/contexts/LanguageContext'
import * as AuthContext from '@/contexts/AuthContext'

// Mock the contexts
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
  LanguageProvider: ({ children }: any) => children,
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: any) => children,
}))

describe('LanguageSwitcher', () => {
  const mockSetLanguage = vi.fn()
  const mockUpdateLanguage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    ;(LanguageContext.useLanguage as any).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
      t: (key: string) => key,
    })
    
    ;(AuthContext.useAuth as any).mockReturnValue({
      isAuthenticated: false,
      updateLanguage: mockUpdateLanguage,
    })
  })

  it('should render language switcher button', () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should display current language flag', () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('🇬🇧')
  })

  it('should show language label when showLabel is true', () => {
    render(<LanguageSwitcher showLabel={true} />)
    
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it.skip('should open dropdown menu on click', async () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('العربية')).toBeInTheDocument()
    })
  })

  it.skip('should change language when selecting from dropdown', async () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const arabicOption = screen.getByText('العربية')
      fireEvent.click(arabicOption)
    })
    
    expect(mockSetLanguage).toHaveBeenCalledWith('ar')
  })

  it.skip('should sync language with backend when authenticated', async () => {
    (AuthContext.useAuth as any).mockReturnValue({
      isAuthenticated: true,
      updateLanguage: mockUpdateLanguage,
    })
    
    mockUpdateLanguage.mockResolvedValue(undefined)
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const arabicOption = screen.getByText('العربية')
      fireEvent.click(arabicOption)
    })
    
    expect(mockSetLanguage).toHaveBeenCalledWith('ar')
    await waitFor(() => {
      expect(mockUpdateLanguage).toHaveBeenCalledWith('ar')
    })
  })

  it.skip('should not sync with backend when not authenticated', async () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const arabicOption = screen.getByText('العربية')
      fireEvent.click(arabicOption)
    })
    
    expect(mockSetLanguage).toHaveBeenCalledWith('ar')
    expect(mockUpdateLanguage).not.toHaveBeenCalled()
  })

  it.skip('should show check mark for current language', async () => {
    (LanguageContext.useLanguage as any).mockReturnValue({
      language: 'ar',
      setLanguage: mockSetLanguage,
      t: (key: string) => key,
    })
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const checkIcon = screen.getByRole('menuitem', { name: /العربية/i })
      expect(checkIcon).toBeInTheDocument()
    })
  })

  it.skip('should handle backend sync errors gracefully', async () => {
    (AuthContext.useAuth as any).mockReturnValue({
      isAuthenticated: true,
      updateLanguage: mockUpdateLanguage,
    })
    
    mockUpdateLanguage.mockRejectedValue(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const arabicOption = screen.getByText('العربية')
      fireEvent.click(arabicOption)
    })
    
    // Language should still be changed locally
    expect(mockSetLanguage).toHaveBeenCalledWith('ar')
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to sync language'),
        expect.any(Error)
      )
    })
    
    consoleSpy.mockRestore()
  })
})
