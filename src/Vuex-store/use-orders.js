// composables/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/utils/axios'
import { ref, computed } from 'vue'

export function useOrders() {
  const hasData = ref(false)

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cashier/getall')
      if (data.orders && data.orders.length > 0) {
        hasData.value = true
      }
      return data.orders
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchOnWindowFocus: true, // bisa diaktifkan jika perlu
    refetchInterval: computed(() => (hasData.value ? 2000 : false)), // ⏱️ Refetch tiap 5 detik
  })

  return {
    orders: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch, // tambahkan ini
  }
}

export function useIncome() {
  const query = useQuery({
    queryKey: ['income'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cashier/get-income')
      return data
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchOnWindowFocus: true, // bisa diaktifkan jika perlu
  })
  return {
    income: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await axiosInstance.put(`/cashier/update/${orderId}`, { status })
      return response.data
    },
    onSuccess: () => {
      // Setelah sukses, bisa invalidate data orders biar refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      console.error('Gagal update status:', error)
    },
  })

  return mutation
}

export function useOrderById(id) {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('ID order tidak ditemukan')
      const { data } = await axiosInstance.get(`/cashier/getby-id/${id}`)
      return data.order
    },
    enabled: !!id, // hanya jalan kalau ID ada
    staleTime: 1000 * 60 * 5,
  })
}
