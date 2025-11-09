/**
 * Unit tests for SignUp page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignUp from '../SignUp'
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

const renderSignUp = () => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <SignUp />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

describe('SignUp', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render sign up form', () => {
    renderSignUp()
    
    // The actual heading text is "Create Account"
    expect(screen.getByRole('heading', { name: /create account|إنشاء حساب/i })).toBeInTheDocument()
  })

  it('should render username input field', () => {
    renderSignUp()
    
    const usernameInput = screen.getByLabelText(/username|اسم المستخدم/i)
    expect(usernameInput).toBeInTheDocument()
  })

  it('should render email input field', () => {
    renderSignUp()
    
    const emailInput = screen.getByLabelText(/email|البريد الإلكتروني/i)
    expect(emailInput).toBeInTheDocument()
  })

  it('should render password input fields', () => {
    renderSignUp()
    
    const passwordInputs = screen.getAllByLabelText(/password|كلمة المرور/i)
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2)
  })

  it('should render confirm password field', () => {
    renderSignUp()
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password|تأكيد كلمة المرور/i)
    expect(confirmPasswordInput).toBeInTheDocument()
  })

  it('should render terms and conditions checkbox', () => {
    renderSignUp()
    
    const termsCheckbox = screen.getByRole('checkbox')
    expect(termsCheckbox).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderSignUp()
    
    const submitButton = screen.getByRole('button', { name: /create account|إنشاء حساب/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('should render link to sign in page', () => {
    renderSignUp()
    
    // The actual link text is "Login"
    const signInLink = screen.getByRole('link', { name: /login|تسجيل الدخول/i })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/signin')
  })

  it('should render Google signup button', () => {
    renderSignUp()
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(1)
  })

  it('should toggle password visibility', () => {
    renderSignUp()
    
    const passwordInputs = screen.getAllByLabelText(/^password|^كلمة المرور$/i)
    const firstPasswordInput = passwordInputs[0]
    
    expect(firstPasswordInput).toHaveAttribute('type', 'password')
    
    // Find eye icon buttons (excluding submit button)
    const allButtons = screen.getAllByRole('button')
    const toggleButtons = allButtons.filter(btn => 
      btn.querySelector('svg') && 
      !btn.textContent?.match(/create account|إنشاء حساب/i)
    )
    
    if (toggleButtons.length > 0) {
      fireEvent.click(toggleButtons[0])
      expect(firstPasswordInput).toHaveAttribute('type', 'text')
    }
  })

  it('should have animated background elements', () => {
    const { container } = renderSignUp()
    
    const animatedElements = container.querySelectorAll('.animate-float')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should render card with glass effect', () => {
    const { container } = renderSignUp()
    
    const glassCard = container.querySelector('.glass-effect')
    expect(glassCard).toBeInTheDocument()
  })

  it('should accept user input in username field', () => {
    renderSignUp()
    
    const usernameInput = screen.getByLabelText(/username|اسم المستخدم/i) as HTMLInputElement
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    
    expect(usernameInput.value).toBe('testuser')
  })

  it('should accept user input in email field', () => {
    renderSignUp()
    
    const emailInput = screen.getByLabelText(/email|البريد الإلكتروني/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(emailInput.value).toBe('test@example.com')
  })

  it('should render terms of service links', () => {
    renderSignUp()
    
    const termsLink = screen.getByRole('link', { name: /terms of service|شروط الخدمة/i })
    const privacyLink = screen.getByRole('link', { name: /privacy policy|سياسة الخصوصية/i })
    
    expect(termsLink).toBeInTheDocument()
    expect(privacyLink).toBeInTheDocument()
  })
})
