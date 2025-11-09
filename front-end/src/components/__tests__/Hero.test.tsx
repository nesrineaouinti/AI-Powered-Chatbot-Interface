/**
 * Unit tests for Hero component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Hero from '../Hero'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderHero = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('Hero', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render hero section', () => {
    renderHero()
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render Get Started button', () => {
    renderHero()
    
    const getStartedButton = screen.getByRole('button', { name: /get started|ابدأ الآن/i })
    expect(getStartedButton).toBeInTheDocument()
  })

  it('should render Learn More button', () => {
    renderHero()
    
    const learnMoreButton = screen.getByRole('button', { name: /learn more|اعرف المزيد/i })
    expect(learnMoreButton).toBeInTheDocument()
  })

  it('should navigate to signup when Get Started is clicked', () => {
    renderHero()
    
    const getStartedButton = screen.getByRole('button', { name: /get started|ابدأ الآن/i })
    fireEvent.click(getStartedButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  it('should render feature pills', () => {
    renderHero()
    
    // Check for feature pills text
    expect(screen.getByText(/fast|سريع/i)).toBeInTheDocument()
    expect(screen.getByText(/secure|آمن/i)).toBeInTheDocument()
  })

  it('should render badge with sparkles icon', () => {
    const { container } = renderHero()
    
    // Check for badge container
    const badge = container.querySelector('.bg-primary\\/10')
    expect(badge).toBeInTheDocument()
  })

  it('should have animated background elements', () => {
    const { container } = renderHero()
    
    // Check for animated background divs
    const animatedElements = container.querySelectorAll('.animate-float')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should render scroll indicator', () => {
    const { container } = renderHero()
    
    // Check for scroll indicator with bounce animation
    const scrollIndicator = container.querySelector('.animate-bounce')
    expect(scrollIndicator).toBeInTheDocument()
  })
})
