import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { IClient, INotification } from '@/types/interfaces'
import Handlebars from 'handlebars'

const AppDataContext = createContext<null | Record<string, unknown>>({})

export const useAppDataContext = () => {
  return useContext(AppDataContext)
}

export const useAppData = (template: string) => {
  const appState = useAppState()
  const appData = useContext(AppDataContext)
  if (!appState || !appState?.appState.readOnly) {
    return template
  }

  return Handlebars?.compile(template || '')(appData)
}

export const AppDataProvider = ({ children }: PropsWithChildren) => {
  const appState = useAppState()

  const data = useMemo(() => {
    if (!appState) {
      return null
    }
    const _client = appState.appState.clientList.find(
      (el) => el.id === (appState.appState.selectedClient as IClient)?.id,
    )
    //add comma separator for custom fields
    const customFields: any = _client?.customFields

    // Iterate through each key in customFields
    for (const key in customFields) {
      // Check if the value is an array and if the key exists in allCustomFields
      if (
        Array.isArray(customFields[key]) &&
        appState?.appState.customFields.some((field) => field.key === key)
      ) {
        // Map the values to their corresponding labels
        customFields[key] = customFields[key].map((value: string[]) => {
          const option: any = (appState?.appState?.customFields as any)
            .find((field: any) => field.key === key)
            .options.find((opt: any) => opt.key === value)
          return option ? ' ' + option.label : ' ' + value
        })
      }
    }

    let count = 0
    appState?.appState.settings?.notifications?.map((el) => {
      if (el.show) {
        if (appState?.appState.notifications) {
          count +=
            appState?.appState.notifications[el.key as keyof INotification]
        }
      }
    })

    const task = { count }

    const invoice = {
      count: appState?.appState.notifications?.billing,
    }

    const form = {
      count: appState?.appState.notifications?.forms,
    }

    const contract = {
      count: appState?.appState.notifications?.contracts,
    }

    const client = {
      ..._client,
      ...customFields,
      company: appState?.appState.selectedClientCompanyName,
    }

    return {
      client,
      invoice,
      task,
      form,
      contract,
    }
  }, [
    appState?.appState.selectedClient,
    appState?.appState.selectedClientCompanyName,
    appState?.appState.notifications,
  ])

  return (
    <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>
  )
}
