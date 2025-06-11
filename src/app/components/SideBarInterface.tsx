'use client'

import { CopilotSelector } from '@/components/CopilotSelector'
import ImagePicker from '@/components/ImagePicker/ImagePicker'
import AutofillFields from '@/components/autofillFields/AutofillFields'
import ColorPicker from '@/components/colorPicker/ColorPicker'
import DisplayTasksToggle from '@/components/display/DisplayTasksToggle'
import { useAppState } from '@/hooks/useAppState'
import { IClient, ICustomField } from '@/types/interfaces'
import { clientToSelectorOption } from '@/utils/designSystem'
import { fetcher } from '@/utils/fetcher'
import { ImagePickerUtils } from '@/utils/imagePickerUtils'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

import 'copilot-design-system/dist/styles/main.css'
import { CompanyResponse } from '@/types/common'

interface IEditorInterface {
  displayTasks: boolean
  clientList: IClient[]
  companies: CompanyResponse[]
  customFields: ICustomField[]
}

const SideBarInterface: FC<IEditorInterface> = ({
  displayTasks,
  clientList,
  companies,
  customFields,
}) => {
  const sideBarRef = useRef<HTMLDivElement | null>(null)

  const appState = useAppState()

  const [showImage, setShowImage] = useState('')

  const defaultValue = null

  const [dropdownSelectedClient, setDropdownSelectedClient] =
    useState<IClient | null>(defaultValue)
  const [previewClientId, setPreviewClientId] = useState<string | null>(null)

  const { data } = useSWR(
    `${
      dropdownSelectedClient === defaultValue || dropdownSelectedClient === null
        ? ''
        : `api/notifications?token=${appState?.appState?.token}&clientId=${
            (dropdownSelectedClient as IClient).id
          }&companyId=${(dropdownSelectedClient as IClient)?.companyId}`
    }`,
    fetcher,
    { refreshInterval: 5000 },
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
  }, [displayTasks, clientList, companies, customFields])

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
          name='previewClientId'
          placeholder={'Preview mode off'}
          grouped={false}
          limitSelectedOptions={1}
          onChange={(input) => setPreviewClientId(input[0].id)}
          clientUsers={clientToSelectorOption(
            appState?.appState.clientList || [],
          )}
          companies={[]}
          internalUsers={[]}
          value={previewClientId}
        />

        {/* <Select */}
        {/*   name='Preview mode' */}
        {/*   customOptions={ */}
        {/*     <> */}
        {/*       <div */}
        {/*         className={`hover:bg-slate-50 py-2 px-3 ${ */}
        {/*           dropdownSelectedClient === defaultValue ? 'bg-slate-50' : '' */}
        {/*         }`} */}
        {/*         onClick={() => setDropdownSelectedClient(defaultValue)} */}
        {/*       > */}
        {/*         {defaultValue} */}
        {/*       </div> */}
        {/*       {appState?.appState.clientList && */}
        {/*         appState?.appState.clientList.map((val, key) => { */}
        {/*           return ( */}
        {/*             <Stack */}
        {/*               key={val.id ?? key} */}
        {/*               direction='row' */}
        {/*               alignItems='flex-start' */}
        {/*               columnGap={0.5} */}
        {/*               className='py-2 px-3' */}
        {/*             > */}
        {/*               {val.avatarImageUrl ? ( */}
        {/*                 <Box key={key}> */}
        {/*                   <Image */}
        {/*                     src={val.avatarImageUrl} */}
        {/*                     alt={val.givenName} */}
        {/*                     width={20} */}
        {/*                     height={10} */}
        {/*                     style={{ borderRadius: '50%', marginTop: '2px' }} */}
        {/*                   /> */}
        {/*                 </Box> */}
        {/*               ) : ( */}
        {/*                 <Stack */}
        {/*                   key={key} */}
        {/*                   sx={{ */}
        {/*                     width: 20, */}
        {/*                     height: 20, */}
        {/*                     borderRadius: '50%', */}
        {/*                     background: `${generateRandomHexColor()}`, */}
        {/*                     opacity: 0.8, */}
        {/*                     alignItems: 'center', */}
        {/*                     padding: '10px', */}
        {/*                     justifyContent: 'center', */}
        {/*                     marginTop: '2px', */}
        {/*                   }} */}
        {/*                 > */}
        {/*                   <p style={{ fontSize: '14px' }}> */}
        {/*                     {val.givenName.charAt(0)} */}
        {/*                   </p> */}
        {/*                 </Stack> */}
        {/*               )} */}
        {/*               <div */}
        {/*                 key={key} */}
        {/*                 className={`hover:bg-slate-50 ${ */}
        {/*                   dropdownSelectedClient === val.givenName */}
        {/*                     ? 'bg-slate-50' */}
        {/*                     : '' */}
        {/*                 }`} */}
        {/*                 onClick={() => setDropdownSelectedClient(val)} */}
        {/*               > */}
        {/*                 {val.givenName} {val.familyName} */}
        {/*               </div> */}
        {/*             </Stack> */}
        {/*           ) */}
        {/*         })} */}
        {/*     </> */}
        {/*   } */}
        {/*   selected={ */}
        {/*     dropdownSelectedClient === defaultValue */}
        {/*       ? defaultValue */}
        {/*       : (dropdownSelectedClient as IClient).givenName */}
        {/*   } */}
        {/* /> */}
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
