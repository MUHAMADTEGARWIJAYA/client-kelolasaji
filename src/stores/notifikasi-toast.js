import { defineStore } from 'pinia' // Perbaikan impor defineStore
import { toast } from 'vue3-toastify' // Pastikan vue3-toastify sudah diinstal
import 'vue3-toastify/dist/index.css' // Impor gaya toast agar bekerja

export const useNotifyStore = defineStore('notify', () => {
  const toastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  }

  const notify = (type, message = 'Something went wrong') => {
    switch (type) {
      case 'success':
        toast.success(message, toastOptions)
        break
      case 'error':
        toast.error(message, toastOptions)
        break
      case 'info':
        toast.info(message, toastOptions)
        break
      case 'warn':
        toast.warn(message, toastOptions)
        break
      default:
        toast(message, toastOptions)
    }
  }

  return { notify }
})
