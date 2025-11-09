/**
 * Unit tests for Input component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should accept and display value', () => {
    render(<Input value="test value" onChange={() => {}} />)
    
    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()
  })

  it('should handle onChange events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-input')
  })

  it('should support different input types', () => {
    const { container, rerender } = render(<Input type="text" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
    
    rerender(<Input type="email" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" />)
    // Password inputs don't have role="textbox", so query by type
    input = container.querySelector('input[type="password"]') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should display placeholder text', () => {
    render(<Input placeholder="Search..." />)
    
    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeInTheDocument()
  })

  it('should support required attribute', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should support readonly attribute', () => {
    render(<Input readOnly value="readonly text" />)
    
    const input = screen.getByDisplayValue('readonly text')
    expect(input).toHaveAttribute('readonly')
  })
})
