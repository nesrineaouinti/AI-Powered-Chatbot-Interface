/**
 * Unit tests for PublicRoute component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRoute from '../PublicRoute'
import React from 'react'

// Create a mock AuthContext for testing
const AuthContext = React.createContext<any>(null)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to)
      return <div>Redirecting to {to}</div>
    },
  }
})

const renderPublicRoute = (authValue: any, restricted = false) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute restricted={restricted}>
                <div>Public Content</div>
              </PublicRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('PublicRoute', () => {
  it.skip('should show loading spinner when loading', () => {
    const authValue = {
      isAuthenticated: false,
      loading: true,
      user: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      googleLogin: vi.fn(),
      updateProfile: vi.fn(),
      updateLanguage: vi.fn(),
      submitting: false,
    }

    renderPublicRoute(authValue)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it.skip('should render children when not authenticated', () => {
    const authValue = {
      isAuthenticated: false,
      loading: false,
      user: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      googleLogin: vi.fn(),
      updateProfile: vi.fn(),
      updateLanguage: vi.fn(),
      submitting: false,
    }

    renderPublicRoute(authValue)
    
    expect(screen.getByText('Public Content')).toBeInTheDocument()
  })

  it.skip('should render children when authenticated and not restricted', () => {
    const authValue = {
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'test', email: 'test@example.com' },
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      googleLogin: vi.fn(),
      updateProfile: vi.fn(),
      updateLanguage: vi.fn(),
      submitting: false,
    }

    renderPublicRoute(authValue, false)
    
    expect(screen.getByText('Public Content')).toBeInTheDocument()
  })

  it.skip('should redirect to chatbot when authenticated and restricted', () => {
    const authValue = {
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'test', email: 'test@example.com' },
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      googleLogin: vi.fn(),
      updateProfile: vi.fn(),
      updateLanguage: vi.fn(),
      submitting: false,
    }

    renderPublicRoute(authValue, true)
    
    expect(screen.getByText(/redirecting to \/chatbot/i)).toBeInTheDocument()
  })

  it.skip('should show loading spinner with icon', () => {
    const authValue = {
      isAuthenticated: false,
      loading: true,
      user: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      googleLogin: vi.fn(),
      updateProfile: vi.fn(),
      updateLanguage: vi.fn(),
      submitting: false,
    }

    const { container } = renderPublicRoute(authValue)
    
    // Check for spinner icon
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
