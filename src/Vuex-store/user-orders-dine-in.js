// composables/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/utils/axios'
import { ref, computed } from 'vue'

export function useOrdersDineIn() {
  const hasData = ref(false)

  const query = useQuery({
    queryKey: ['orders-dine-in'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/order/getall')
      if (data.orders && data.orders.length > 0) {
        hasData.value = true
      }
      return data.orders
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchOnWindowFocus: true,
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

export const useUpdateOrderDineInStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ orderId, status, payment_type }) => {
      const response = await axiosInstance.put(`/order/update/${orderId}`, { status, payment_type })
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

export function useOrderDineInById(id) {
  return useQuery({
    queryKey: ['order-detail-dine-in', id],
    queryFn: async () => {
      if (!id) throw new Error('ID order tidak ditemukan')
      const { data } = await axiosInstance.get(`/order/getby-id/${id}`)
      return data.order
    },
    enabled: !!id, // hanya jalan kalau ID ada
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
  })
}
