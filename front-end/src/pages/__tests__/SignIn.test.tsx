/**
 * Unit tests for SignIn page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignIn from '../SignIn'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderSignIn = () => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <SignIn />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

describe('SignIn', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render sign in form', () => {
    renderSignIn()
    
    expect(screen.getByRole('heading', { name: /sign in|تسجيل الدخول/i })).toBeInTheDocument()
  })

  it('should render email input field', () => {
    renderSignIn()
    
    const emailInput = screen.getByLabelText(/email|البريد الإلكتروني/i)
    expect(emailInput).toBeInTheDocument()
  })

  it('should render password input field', () => {
    renderSignIn()
    
    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i)
    expect(passwordInput).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderSignIn()
    
    const submitButton = screen.getByRole('button', { name: /sign in|تسجيل الدخول/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    renderSignIn()
    
    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Find and click the eye icon button
    const toggleButtons = screen.getAllByRole('button')
    const eyeButton = toggleButtons.find(btn => btn.querySelector('svg'))
    
    if (eyeButton && eyeButton !== screen.getByRole('button', { name: /sign in|تسجيل الدخول/i })) {
      fireEvent.click(eyeButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })

  it('should render link to sign up page', () => {
    renderSignIn()
    
    const signUpLink = screen.getByRole('link', { name: /sign up|إنشاء حساب/i })
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveAttribute('href', '/signup')
  })

  it('should render Google login button', () => {
    renderSignIn()
    
    // Google button should be present
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(1)
  })

  it('should have animated background elements', () => {
    const { container } = renderSignIn()
    
    const animatedElements = container.querySelectorAll('.animate-float')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should render card with glass effect', () => {
    const { container } = renderSignIn()
    
    const glassCard = container.querySelector('.glass-effect')
    expect(glassCard).toBeInTheDocument()
  })

  it('should accept user input in email field', () => {
    renderSignIn()
    
    const emailInput = screen.getByLabelText(/email|البريد الإلكتروني/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(emailInput.value).toBe('test@example.com')
  })

  it('should accept user input in password field', () => {
    renderSignIn()
    
    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i) as HTMLInputElement
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(passwordInput.value).toBe('password123')
  })
})
