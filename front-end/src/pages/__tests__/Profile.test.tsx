/**
 * Unit tests for Profile page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Profile from '../Profile'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock chatService
vi.mock('@/services/chatService', () => ({
  chatService: {
    getSummary: vi.fn(),
    generateSummary: vi.fn(),
  },
}))

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render profile page', () => {
    renderProfile()
    
    expect(screen.getByText(/my profile|ملفي الشخصي/i)).toBeInTheDocument()
  })

  it('should render profile header', () => {
    renderProfile()
    
    const heading = screen.getByRole('heading', { name: /my profile|ملفي الشخصي/i })
    expect(heading).toBeInTheDocument()
  })

  it('should render edit profile button', () => {
    renderProfile()
    
    const editButton = screen.getByRole('button', { name: /edit profile|تعديل الملف/i })
    expect(editButton).toBeInTheDocument()
  })

  it('should render logout button', () => {
    renderProfile()
    
    const logoutButton = screen.getByRole('button', { name: /logout|تسجيل الخروج/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it('should render stats card', () => {
    renderProfile()
    
    // The actual text is "Statistics" not "stats"
    expect(screen.getByText(/statistics|إحصائيات/i)).toBeInTheDocument()
  })

  it('should render AI summary section', () => {
    renderProfile()
    
    // The actual text is "AI-Generated Summary"
    expect(screen.getByText(/ai-generated summary|ملخص الذكاء الاصطناعي/i)).toBeInTheDocument()
  })

  it('should have grid layout', () => {
    const { container } = renderProfile()
    
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('should render profile card', () => {
    const { container } = renderProfile()
    
    // Cards should be present
    const cards = container.querySelectorAll('[class*="card"]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('should render user icon when no profile picture', () => {
    const { container } = renderProfile()
    
    // User icon SVG should be present
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})
