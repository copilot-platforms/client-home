'use client'

import { CopilotSelector } from '@/components/CopilotSelector'
import ImagePicker from '@/components/ImagePicker/ImagePicker'
import AutofillFields from '@/components/autofillFields/AutofillFields'
import ColorPicker from '@/components/colorPicker/ColorPicker'
import DisplayTasksToggle from '@/components/display/DisplayTasksToggle'
import { useAppState } from '@/hooks/useAppState'
import { CompanyResponse, WorkspaceInfo } from '@/types/common'
import { IClient, ICustomField } from '@/types/interfaces'
import { flattenClients } from '@/utils/api'
import {
  clientToSelectorOption,
  companyToSelectorOption,
} from '@/utils/designSystem'
import { fetcher } from '@/utils/fetcher'
import { ImagePickerUtils } from '@/utils/imagePickerUtils'
import 'copilot-design-system/dist/styles/main.css'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

interface IEditorInterface {
  displayTasks: boolean
  clientList: IClient[]
  companies: CompanyResponse[]
  workspace: WorkspaceInfo
  customFields: ICustomField[]
}

const SideBarInterface: FC<IEditorInterface> = ({
  displayTasks,
  clientList,
  companies,
  workspace,
  customFields,
}) => {
  const sideBarRef = useRef<HTMLDivElement | null>(null)

  const appState = useAppState()

  const [showImage, setShowImage] = useState('')

  const defaultValue = null

  const [previewClientId, setPreviewClientId] = useState<string | null>(null)
  const [previewClientCompanyId, setPreviewClientCompanyId] = useState<
    string | null
  >(null)

  const dropdownSelectedClient = useMemo(() => {
    const client = appState?.appState.clientList?.find(
      ({ id }) => id === previewClientId,
    )
    if (!client) return null
    // This is used to handle multiple companies. By overriding the companyId of client for the selected company among its list of multiple companies,
    // we can ensure that the correct client for correct company is selected in the preview mode.
    return { ...client, companyId: previewClientCompanyId }
  }, [appState?.appState.clientList, previewClientId, previewClientCompanyId])

  const handlePreviewSelectorChange = (
    input?: { id: string; companyId: string }[],
  ) => {
    const selectedOption = input?.[0]
    setPreviewClientId(selectedOption?.id || null)
    setPreviewClientCompanyId(selectedOption?.companyId || null)
  }

  const { data } = useSWR(
    `${
      dropdownSelectedClient === defaultValue || dropdownSelectedClient === null
        ? ''
        : `api/notifications?token=${appState?.appState?.token}&clientId=${
            (dropdownSelectedClient as IClient).id
          }&companyId=${(dropdownSelectedClient as IClient)?.companyId}`
    }`,
    fetcher,
    { refreshInterval: 10 * 1000 },
  )

  useMemo(() => {
    if (dropdownSelectedClient === defaultValue) {
      appState?.toggleReadOnly(false)
      appState?.setSelectedClient(null)
      sideBarRef?.current?.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      ;(async () => {
        appState?.toggleReadOnly(true)
        appState?.setSelectedClient(dropdownSelectedClient as IClient)
        appState?.setNotification(data)
        sideBarRef?.current?.scrollTo({ top: 0, behavior: 'instant' })
      })()
    }
  }, [dropdownSelectedClient, data])

  // Set data in appState
  useEffect(() => {
    appState?.toggleDisplayTasks({ override: displayTasks })
    appState?.setClientList(clientList)
    appState?.setCompanies(companies)
    appState?.setCustomFields(customFields)
    appState?.setBrandName(workspace.brandName)
  }, [displayTasks, clientList, companies, customFields, workspace])

  useEffect(() => {
    ;(async () => {
      const imagePickerUtils = new ImagePickerUtils()
      if (appState?.appState.bannerImgUrl instanceof Blob) {
        setShowImage(
          (await imagePickerUtils.convertBlobToUrlString(
            appState?.appState.bannerImgUrl,
          )) as string,
        )
      } else {
        setShowImage(appState?.appState.bannerImgUrl || '')
      }
    })()
  }, [appState?.appState.bannerImgUrl])

  return (
    <div
      style={{
        height: appState?.appState?.changesCreated
          ? 'calc(100vh - 60px)'
          : '100vh',
        overflowY: 'scroll',
      }}
      ref={sideBarRef}
    >
      <div className='py-600 px-500 flex border-1 border-y items-center justify-between'>
        <p className='font-medium'>Preview mode</p>

        <CopilotSelector
          isSearchable={true}
          openMenuOnFocus
          name='previewClientId'
          placeholder={'Preview mode off'}
          grouped={false}
          limitSelectedOptions={1}
          onChange={handlePreviewSelectorChange}
          clientUsers={clientToSelectorOption(
            flattenClients(appState?.appState.clientList),
            appState?.appState.companies,
          )}
          companies={companyToSelectorOption(companies)}
          internalUsers={[]}
          ignoreCompanies={true}
        />
      </div>

      {/* <hr className='bg-slate-300' style={{ padding: 0.1 }} /> */}

      <ImagePicker
        showImage={showImage}
        getImage={async (image) => {
          appState?.setBannerImgUrl(image as Blob)
          appState?.setBannerImgId(image?.type as string)
        }}
      />

      {/* <hr /> */}

      <ColorPicker />

      {/* <hr className='bg-slate-300' style={{ padding: 0.1 }} /> */}
      <DisplayTasksToggle />

      <AutofillFields />

      {/* <hr className='bg-slate-300' style={{ padding: 0.1 }} /> */}
    </div>
  )
}

export default SideBarInterface
