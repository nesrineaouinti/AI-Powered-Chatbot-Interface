/**
 * Unit tests for ProtectedRoute component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
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

const renderProtectedRoute = (authValue: any) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
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

    renderProtectedRoute(authValue)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it.skip('should redirect to signin when not authenticated', () => {
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

    renderProtectedRoute(authValue)
    
    expect(screen.getByText(/redirecting to \/signin/i)).toBeInTheDocument()
  })

  it.skip('should render children when authenticated', () => {
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

    renderProtectedRoute(authValue)
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
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

    const { container } = renderProtectedRoute(authValue)
    
    // Check for spinner icon
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
