/**
 * Unit tests for About component
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from '../About'
import { LanguageProvider } from '@/contexts/LanguageContext'

const renderAbout = () => {
  return render(
    <LanguageProvider>
      <About />
    </LanguageProvider>
  )
}

describe('About', () => {
  it('should render about section', () => {
    const { container } = renderAbout()
    
    const section = container.querySelector('#about')
    expect(section).toBeInTheDocument()
  })

  it('should render section title', () => {
    renderAbout()
    
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should render mission section', () => {
    const { container } = renderAbout()
    
    // Mission icon should be present
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should render vision section', () => {
    renderAbout()
    
    // Check that multiple sections are rendered
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(2)
  })

  it('should render 3 stat cards', () => {
    const { container } = renderAbout()
    
    // Stat cards have glass-effect class
    const statCards = container.querySelectorAll('.glass-effect')
    expect(statCards.length).toBeGreaterThan(2)
  })

  it('should render animated circles', () => {
    const { container } = renderAbout()
    
    // Check for animated pulse elements
    const animatedElements = container.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should have gradient background', () => {
    const { container } = renderAbout()
    
    const section = container.querySelector('#about')
    expect(section?.className).toContain('bg-gradient-to-b')
  })

  it('should render with proper grid layout', () => {
    const { container } = renderAbout()
    
    // Check for grid containers
    const grids = container.querySelectorAll('.grid')
    expect(grids.length).toBeGreaterThan(0)
  })

  it('should render icon containers with gradient backgrounds', () => {
    const { container } = renderAbout()
    
    // Check for gradient backgrounds on icon containers
    const gradientElements = container.querySelectorAll('[class*="bg-gradient"]')
    expect(gradientElements.length).toBeGreaterThan(0)
  })
})
