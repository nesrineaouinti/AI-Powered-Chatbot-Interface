/**
 * Custom test utilities for rendering components with providers
 */
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'
// Override render with our custom version
export { customRender as render }
// Explicitly export commonly used utilities to ensure they're available
export { fireEvent, waitFor, screen } from '@testing-library/react'
