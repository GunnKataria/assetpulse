'use client'

import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function useAssets(status?: string, search?: string, type?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (search) params.append('search', search)
  if (type) params.append('type', type)

  const url = `/api/assets${params.toString() ? '?' + params.toString() : ''}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    assets: data || [],
    loading: isLoading,
    error,
    mutate,
  }
}

export function useAsset(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/assets/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    asset: data,
    loading: isLoading,
    error,
    mutate,
  }
}

export function useAllocations(status?: string, employeeId?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (employeeId) params.append('employeeId', employeeId)

  const url = `/api/allocations${params.toString() ? '?' + params.toString() : ''}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    allocations: data || [],
    loading: isLoading,
    error,
    mutate,
  }
}

export function useRepairs(status?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)

  const url = `/api/repairs${params.toString() ? '?' + params.toString() : ''}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    repairs: data || [],
    loading: isLoading,
    error,
    mutate,
  }
}

export function useWarranty(status?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)

  const url = `/api/warranty${params.toString() ? '?' + params.toString() : ''}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    warranties: data || [],
    loading: isLoading,
    error,
    mutate,
  }
}

export function useEmployees(search?: string, department?: string) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (department) params.append('department', department)

  const url = `/api/employees${params.toString() ? '?' + params.toString() : ''}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    employees: data || [],
    loading: isLoading,
    error,
    mutate,
  }
}
