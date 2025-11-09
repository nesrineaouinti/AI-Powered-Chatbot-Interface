/**
 * Unit tests for Features component
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Features from '../Features'
import { LanguageProvider } from '@/contexts/LanguageContext'

const renderFeatures = () => {
  return render(
    <LanguageProvider>
      <Features />
    </LanguageProvider>
  )
}

describe('Features', () => {
  it('should render features section', () => {
    const { container } = renderFeatures()
    
    const section = container.querySelector('#features')
    expect(section).toBeInTheDocument()
  })

  it('should render section title', () => {
    renderFeatures()
    
    // The title should be a heading
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should render 6 feature cards', () => {
    const { container } = renderFeatures()
    
    // Feature cards have the class 'feature-card'
    const featureCards = container.querySelectorAll('.feature-card')
    expect(featureCards.length).toBe(6)
  })

  it('should render feature icons', () => {
    const { container } = renderFeatures()
    
    // Icons are rendered as SVG elements (6 feature icons)
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThanOrEqual(6)
  })

  it('should render stats section', () => {
    renderFeatures()
    
    // Check for stats values
    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('1M+')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
  })

  it('should render stats labels', () => {
    renderFeatures()
    
    expect(screen.getByText(/uptime/i)).toBeInTheDocument()
    // Use getAllByText for text that appears multiple times
    expect(screen.getAllByText(/conversations/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/languages/i)).toBeInTheDocument()
    // "Support" appears in both "Multi-Language Support" and "Support" stat
    expect(screen.getAllByText(/support/i).length).toBeGreaterThan(0)
  })

  it('should have gradient background', () => {
    const { container } = renderFeatures()
    
    const section = container.querySelector('#features')
    expect(section?.className).toContain('bg-gradient-to-b')
  })

  it('should render with proper grid layout', () => {
    const { container } = renderFeatures()
    
    // Check for grid container
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })
})
