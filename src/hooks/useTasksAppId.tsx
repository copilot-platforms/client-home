import { useAppState } from '@/hooks/useAppState'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export const useTasksAppId = () => {
  const appState = useAppState()
  const token = appState?.appState?.token

  const { data, error, isLoading } = useSWR(
    token ? `/api/tasks-app-id?token=${token}` : null,
    fetcher,
  )

  return {
    appId: data?.appId || null,
    isLoading,
    isError: error,
  }
}
