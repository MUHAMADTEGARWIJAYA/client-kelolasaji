// src/utils/axiosInstance.js
import axios from 'axios'
import router from '@/router';

const api = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: `${api}`,
  withCredentials: true, // penting agar cookie (refreshToken) dikirim
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Tambahkan interceptor untuk menangani token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jika token expired dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.get(
          `${api}auth/refreshtoken`,
          {
            withCredentials: true,
          },
        )
        const newAccessToken = res.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)

        // Set Authorization header ulang
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token gagal:', refreshError)
       window.location.href = '/login' // Redirect ke login
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
