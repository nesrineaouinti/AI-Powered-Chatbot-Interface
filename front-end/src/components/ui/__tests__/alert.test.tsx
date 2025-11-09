/**
 * Unit tests for Alert components
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '../alert'

describe('Alert', () => {
  it('should render alert with children', () => {
    render(<Alert>Alert content</Alert>)
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Alert content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Alert className="custom-alert">Content</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('custom-alert')
  })

  it('should render with default variant', () => {
    render(<Alert>Default Alert</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('bg-background')
  })

  it('should render with destructive variant', () => {
    render(<Alert variant="destructive">Destructive Alert</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('destructive')
  })

  it('should render complete alert structure', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    expect(screen.getByText('Alert Description')).toBeInTheDocument()
  })
})

describe('AlertTitle', () => {
  it('should render title as h5 element', () => {
    render(<AlertTitle>Test Title</AlertTitle>)
    
    const title = screen.getByText('Test Title')
    expect(title.tagName).toBe('H5')
  })

  it('should apply custom className', () => {
    render(<AlertTitle className="custom-title">Title</AlertTitle>)
    
    const title = screen.getByText('Title')
    expect(title.className).toContain('custom-title')
  })

  it('should have font styling classes', () => {
    render(<AlertTitle>Styled Title</AlertTitle>)
    
    const title = screen.getByText('Styled Title')
    expect(title.className).toContain('font-medium')
  })
})

describe('AlertDescription', () => {
  it('should render description', () => {
    render(<AlertDescription>Test description</AlertDescription>)
    
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<AlertDescription className="custom-desc">Description</AlertDescription>)
    
    const description = screen.getByText('Description')
    expect(description.className).toContain('custom-desc')
  })

  it('should have text size class', () => {
    render(<AlertDescription>Description text</AlertDescription>)
    
    const description = screen.getByText('Description text')
    expect(description.className).toContain('text-sm')
  })

  it('should render HTML content', () => {
    render(
      <AlertDescription>
        <p>Paragraph content</p>
      </AlertDescription>
    )
    
    expect(screen.getByText('Paragraph content')).toBeInTheDocument()
  })
})
