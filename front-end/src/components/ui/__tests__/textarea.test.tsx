/**
 * Unit tests for Textarea component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('should render textarea element', () => {
    render(<Textarea placeholder="Enter text" />)
    
    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea).toBeInTheDocument()
  })

  it('should accept and display value', () => {
    render(<Textarea value="test value" onChange={() => {}} />)
    
    const textarea = screen.getByDisplayValue('test value')
    expect(textarea).toBeInTheDocument()
  })

  it('should handle onChange events', () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea.className).toContain('custom-textarea')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLTextAreaElement | null }
    render(<Textarea ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('should display placeholder text', () => {
    render(<Textarea placeholder="Type here..." />)
    
    const textarea = screen.getByPlaceholderText('Type here...')
    expect(textarea).toBeInTheDocument()
  })

  it('should support required attribute', () => {
    render(<Textarea required />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeRequired()
  })

  it('should support readonly attribute', () => {
    render(<Textarea readOnly value="readonly text" />)
    
    const textarea = screen.getByDisplayValue('readonly text')
    expect(textarea).toHaveAttribute('readonly')
  })

  it('should support rows attribute', () => {
    render(<Textarea rows={5} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('should have minimum height class', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea.className).toContain('min-h-')
  })
})
