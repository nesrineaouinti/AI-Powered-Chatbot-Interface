/**
 * Unit tests for Label component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '../label'

describe('Label', () => {
  it('should render label element', () => {
    render(<Label>Test Label</Label>)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should apply htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Label Text</Label>)
    
    const label = screen.getByText('Label Text')
    expect(label).toHaveAttribute('for', 'input-id')
  })

  it('should apply custom className', () => {
    render(<Label className="custom-label">Label</Label>)
    
    const label = screen.getByText('Label')
    expect(label.className).toContain('custom-label')
  })

  it('should render children correctly', () => {
    render(
      <Label>
        <span>Complex Label</span>
      </Label>
    )
    
    expect(screen.getByText('Complex Label')).toBeInTheDocument()
  })

  it('should have default font styling classes', () => {
    render(<Label>Styled Label</Label>)
    
    const label = screen.getByText('Styled Label')
    expect(label.className).toContain('text-sm')
    expect(label.className).toContain('font-medium')
  })

  it('should support onClick events', () => {
    const handleClick = vi.fn()
    render(<Label onClick={handleClick}>Clickable Label</Label>)
    
    const label = screen.getByText('Clickable Label')
    label.click()
    
    expect(handleClick).toHaveBeenCalled()
  })
})
