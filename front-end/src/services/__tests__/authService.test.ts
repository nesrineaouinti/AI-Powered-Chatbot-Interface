/**
 * Unit tests for authService
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../authService'
import { mockUser, mockAuthTokens } from '@/test/mockData'

// Mock fetch globally
global.fetch = vi.fn()

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('signup', () => {
    it('should successfully signup a new user', async () => {
      const signupData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        password_confirm: 'password123',
        first_name: 'New',
        last_name: 'User',
      }

      const mockResponse = {
        message: 'User created successfully',
        user: mockUser,
        tokens: mockAuthTokens,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await authService.signup(signupData)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signup/'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        })
      )
    })

    it('should throw error on failed signup', async () => {
      const signupData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        password_confirm: 'password123',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Username already exists' }),
      })

      await expect(authService.signup(signupData)).rejects.toThrow()
    })
  })

  describe('login', () => {
    it('should successfully login a user', async () => {
      const credentials = {
        username_or_email: 'testuser',
        password: 'password123',
      }

      const mockResponse = {
        message: 'Login successful',
        user: mockUser,
        tokens: mockAuthTokens,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await authService.login(credentials)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(credentials),
        })
      )
    })

    it('should throw error on failed login', async () => {
      const credentials = {
        username_or_email: 'testuser',
        password: 'wrongpassword',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      })

      await expect(authService.login(credentials)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logged out successfully' }),
      })

      await authService.logout('refresh-token', 'access-token')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/logout/'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        })
      )
    })
  })

  describe('getProfile', () => {
    it('should get user profile', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await authService.getProfile('access-token')

      expect(result).toEqual(mockUser)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/profile/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        })
      )
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updates = { first_name: 'Updated', last_name: 'Name' }
      const updatedUser = { ...mockUser, ...updates }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUser,
      })

      const result = await authService.updateProfile('access-token', updates)

      expect(result).toEqual(updatedUser)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/profile/'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      )
    })
  })

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      const newTokens = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => newTokens,
      })

      const result = await authService.refreshToken('refresh-token')

      expect(result).toEqual(newTokens)
    })
  })

  describe('Local storage helpers', () => {
    it('should save and get tokens', () => {
      authService.saveTokens(mockAuthTokens)

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', mockAuthTokens.access)
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', mockAuthTokens.refresh)

      ;(localStorage.getItem as any).mockReturnValueOnce(mockAuthTokens.access)
      expect(authService.getAccessToken()).toBe(mockAuthTokens.access)

      ;(localStorage.getItem as any).mockReturnValueOnce(mockAuthTokens.refresh)
      expect(authService.getRefreshToken()).toBe(mockAuthTokens.refresh)
    })

    it('should save and get user', () => {
      authService.saveUser(mockUser)

      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))

      ;(localStorage.getItem as any).mockReturnValueOnce(JSON.stringify(mockUser))
      expect(authService.getUser()).toEqual(mockUser)
    })

    it('should clear auth data', () => {
      authService.clearAuth()

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })

    it('should check if user is authenticated', () => {
      (localStorage.getItem as any).mockReturnValueOnce(null)
      expect(authService.isAuthenticated()).toBe(false)

      ;(localStorage.getItem as any).mockReturnValueOnce('some-token')
      expect(authService.isAuthenticated()).toBe(true)
    })
  })
})
