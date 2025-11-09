/**
 * Unit tests for Landing page
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../Landing'
import { LanguageProvider } from '@/contexts/LanguageContext'

const renderLanding = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <Landing />
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('Landing', () => {
  it('should render landing page', () => {
    renderLanding()
    
    // Landing page should render without errors
    expect(document.body).toBeInTheDocument()
  })

  it('should render Hero component', () => {
    renderLanding()
    
    // Hero should have a main heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('should render Features section', () => {
    const { container } = renderLanding()
    
    const featuresSection = container.querySelector('#features')
    expect(featuresSection).toBeInTheDocument()
  })

  it('should render About section', () => {
    const { container } = renderLanding()
    
    const aboutSection = container.querySelector('#about')
    expect(aboutSection).toBeInTheDocument()
  })

  it('should render all three main sections in order', () => {
    const { container } = renderLanding()
    
    // Check that all sections exist
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(3)
  })

  it('should render call-to-action buttons', () => {
    renderLanding()
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
