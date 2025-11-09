/**
 * Unit tests for Button component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not trigger click when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('bg-primary')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('border')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('hover:bg-accent')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('h-10')
    
    rerender(<Button size="sm">Small</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('h-11')
    
    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('h-10')
    expect(button.className).toContain('w-10')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should support type attribute', () => {
    const { rerender } = render(<Button type="button">Button</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    
    rerender(<Button type="submit">Submit</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
