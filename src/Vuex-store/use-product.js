import { useQuery } from '@tanstack/vue-query'
import axiosInstance from '@/utils/axios'
export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/product/getby-id-umkm')
      return data.products
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchOnWindowFocus: true, // bisa diaktifkan jika perlu
  })
  return {
    products: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
