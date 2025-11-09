/**
 * Unit tests for Spinner component
 */
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('should render spinner SVG element', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should have animate-spin class', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    // SVG className is an SVGAnimatedString, access baseVal for the actual class string
    expect(svg?.classList.contains('animate-spin')).toBe(true)
  })

  it('should render circle and path elements', () => {
    const { container } = render(<Spinner />)
    
    const circle = container.querySelector('circle')
    const path = container.querySelector('path')
    
    expect(circle).toBeInTheDocument()
    expect(path).toBeInTheDocument()
  })

  it('should have correct viewBox', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('should render without errors', () => {
    expect(() => render(<Spinner />)).not.toThrow()
  })
})
