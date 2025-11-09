/**
 * Unit tests for Card components
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card'

describe('Card', () => {
  it('should render card with children', () => {
    render(<Card>Card content</Card>)
    
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-card')
  })

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
    expect(screen.getByText('Card Footer')).toBeInTheDocument()
  })
})

describe('CardHeader', () => {
  it('should render header with children', () => {
    render(<CardHeader>Header content</CardHeader>)
    
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Content</CardHeader>)
    
    const header = container.firstChild as HTMLElement
    expect(header.className).toContain('custom-header')
  })
})

describe('CardTitle', () => {
  it('should render title as h3 element', () => {
    render(<CardTitle>Test Title</CardTitle>)
    
    const title = screen.getByText('Test Title')
    expect(title.tagName).toBe('H3')
  })

  it('should apply custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    
    const title = screen.getByText('Title')
    expect(title.className).toContain('custom-title')
  })
})

describe('CardDescription', () => {
  it('should render description as paragraph', () => {
    render(<CardDescription>Test description</CardDescription>)
    
    const description = screen.getByText('Test description')
    expect(description.tagName).toBe('P')
  })

  it('should apply custom className', () => {
    render(<CardDescription className="custom-desc">Description</CardDescription>)
    
    const description = screen.getByText('Description')
    expect(description.className).toContain('custom-desc')
  })
})

describe('CardContent', () => {
  it('should render content with children', () => {
    render(<CardContent>Content area</CardContent>)
    
    expect(screen.getByText('Content area')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>)
    
    const content = container.firstChild as HTMLElement
    expect(content.className).toContain('custom-content')
  })
})

describe('CardFooter', () => {
  it('should render footer with children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>)
    
    const footer = container.firstChild as HTMLElement
    expect(footer.className).toContain('custom-footer')
  })
})
