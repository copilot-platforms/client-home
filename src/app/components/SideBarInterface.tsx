'use client'

import ImagePicker from '@/components/ImagePicker/ImagePicker'
import ColorPicker from '@/components/colorPicker/ColorPicker'
import AutofillFields from '@/components/autofillFields/AutofillFields'
import Select from '@/components/select/Select'
import { useAppState } from '@/hooks/useAppState'
import { ImagePickerUtils } from '@/utils/imagePickerUtils'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { IClient, ICustomField } from '@/types/interfaces'
import { Box, Stack } from '@mui/material'
import Image from 'next/image'
import { generateRandomHexColor } from '@/utils/generateRandomHexColor'
import DisplayTasksToggle from '@/components/display/DisplayTasksToggle'

interface IEditorInterface {
  displayTasks: boolean
  clientList: IClient[]
  customFields: ICustomField[]
}

const SideBarInterface: FC<IEditorInterface> = ({
  displayTasks,
  clientList,
  customFields,
}) => {
  const sideBarRef = useRef<HTMLDivElement | null>(null)

  const appState = useAppState()

  const [showImage, setShowImage] = useState('')

  const defaultValue = 'Preview mode off'

  const [dropdownSelectedClient, setDropdownSelectedClient] = useState<
    IClient | string | null
  >(defaultValue)

  const getNotifications = async (clientId: string) => {
    const notifications = await fetch(
      `api/notifications?token=${appState?.appState?.token}&clientId=${clientId}`,
    )
    return await notifications.json()
  }

  useMemo(() => {
    if (dropdownSelectedClient === defaultValue) {
      appState?.toggleReadOnly(false)
      appState?.setSelectedClient(null)
      sideBarRef?.current?.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      ;(async () => {
        appState?.toggleReadOnly(true)
        appState?.setSelectedClient(dropdownSelectedClient as IClient)
        const notifications = await getNotifications(
          (dropdownSelectedClient as IClient).id,
        )
        appState?.setNotification(notifications)
        sideBarRef?.current?.scrollTo({ top: 0, behavior: 'instant' })
      })()
    }
  }, [dropdownSelectedClient])

  useEffect(() => {
    appState?.toggleDisplayTasks({ override: displayTasks })
    appState?.setClientList(clientList)
    appState?.setCustomFields(customFields)
  }, [displayTasks, clientList, customFields])

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
        <Select
          name='Preview mode'
          customOptions={
            <>
              <div
                className={`hover:bg-slate-50 py-2 px-3 ${
                  dropdownSelectedClient === defaultValue ? 'bg-slate-50' : ''
                }`}
                onClick={() => setDropdownSelectedClient(defaultValue)}
              >
                {defaultValue}
              </div>
              {appState?.appState.clientList &&
                appState?.appState.clientList.map((val, key) => {
                  return (
                    <Stack
                      key={val.id ?? key}
                      direction='row'
                      alignItems='flex-start'
                      columnGap={0.5}
                      className='py-2 px-3'
                    >
                      {val.avatarImageUrl ? (
                        <Box key={key}>
                          <Image
                            src={val.avatarImageUrl}
                            alt={val.givenName}
                            width={20}
                            height={10}
                            style={{ borderRadius: '50%', marginTop: '2px' }}
                          />
                        </Box>
                      ) : (
                        <Stack
                          key={key}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: `${generateRandomHexColor()}`,
                            opacity: 0.8,
                            alignItems: 'center',
                            padding: '10px',
                            justifyContent: 'center',
                            marginTop: '2px',
                          }}
                        >
                          <p style={{ fontSize: '14px' }}>
                            {val.givenName.charAt(0)}
                          </p>
                        </Stack>
                      )}
                      <div
                        key={key}
                        className={`hover:bg-slate-50 ${
                          dropdownSelectedClient === val.givenName
                            ? 'bg-slate-50'
                            : ''
                        }`}
                        onClick={() => setDropdownSelectedClient(val)}
                      >
                        {val.givenName} {val.familyName}
                      </div>
                    </Stack>
                  )
                })}
            </>
          }
          selected={
            dropdownSelectedClient === defaultValue
              ? defaultValue
              : (dropdownSelectedClient as IClient).givenName
          }
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
