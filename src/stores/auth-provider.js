// src/stores/auth.js
import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios'

export const useAuthProvider = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    error: null, // tambahkan ini
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await axiosInstance.post('/auth/login', { email, password })
        this.user = res.data.user
        this.isAuthenticated = true
        this.error = null
        localStorage.setItem('accessToken', res.data.accessToken)
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
        return true
      } catch (err) {
        this.isAuthenticated = false
        this.error = err.response?.data?.message || err.message
        console.error('Login gagal:', this.error)
        return false
      }
    },

    async register(username, email, password, role, umkm_id) {
      try {
        const res = await axiosInstance.post('/auth/register', {
          username,
          email,
          password,
          role,
          umkm_id,
        })
        this.user = res.data.user
        this.isAuthenticated = true
        localStorage.setItem('accessToken', res.data.accessToken)
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
        return true
      } catch (err) {
        this.isAuthenticated = false
        console.error('Register gagal:', err.response?.data?.message || err.message)
        return false
      }
    },

    async logout() {
      try {
        await axiosInstance.post('/auth/logout')
        localStorage.removeItem('accessToken')
        this.user = null
        this.isAuthenticated = false
        delete axiosInstance.defaults.headers.common['Authorization']
      } catch (err) {
        console.error('Logout gagal:', err)
      }
    },

    async checkAuth() {
      try {
        const res = await axiosInstance.get('/auth/getuser')
        this.user = res.data.user
        this.isAuthenticated = true
      } catch (err) {
        this.isAuthenticated = false
        console.error('Check auth gagal:', err)
      }
    },

    // async refreshToken() {
    //   try {
    //     const res = await axiosInstance.get('/auth/refresh-token')
    //     const newAccessToken = res.data.accessToken
    //     localStorage.setItem('accessToken', newAccessToken)
    //     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
    //     await this.checkAuth()
    //     return newAccessToken
    //   } catch (err) {
    //     this.isAuthenticated = false
    //     console.error('Refresh token gagal:', err)
    //     throw new Error('Harus login ulang')
    //   }
    // },
  },
})
