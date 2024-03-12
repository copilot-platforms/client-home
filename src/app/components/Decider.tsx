// 'use client'

// import { useAppState } from '@/hooks/useAppState'
// import { IClient, ISettings } from '@/types/interfaces'
// import EditorInterface from './EditorInterface'
// import ReadonlyEditorInterface from './ReadonlyEditorInterface'
// import Handlebars from 'handlebars'
// import { useEffect, useState } from 'react'

// interface IEditorInterface {
//   settings: ISettings | null
//   token: string
// }

// export const Decider = ({ settings, token }: IEditorInterface) => {
//   const appState = useAppState()
//   const [content, setContent] = useState('')

//   const setNewContent = async (content: string) => {
//     setContent(content)
//   }

//   useEffect(() => {
//     if (appState?.appState.readOnly) {
//       const template = Handlebars?.compile(
//         appState?.appState.originalTemplate || '',
//       )
//       const _client = appState.appState.clientList.find(
//         (el) => el.id === (appState.appState.selectedClient as IClient).id,
//       )
//       //add comma separator for custom fields
//       const customFields: any = _client?.customFields

//       // Iterate through each key in customFields
//       for (const key in customFields) {
//         // Check if the value is an array and if the key exists in allCustomFields
//         if (
//           Array.isArray(customFields[key]) &&
//           appState?.appState.customFields.some((field) => field.key === key)
//         ) {
//           // Map the values to their corresponding labels
//           customFields[key] = customFields[key].map((value: string[]) => {
//             const option: any = (appState?.appState?.customFields as any)
//               .find((field: any) => field.key === key)
//               .options.find((opt: any) => opt.key === value)
//             return option ? ' ' + option.label : ' ' + value
//           })
//         }
//       }

//       const task = {
//         count: 10,
//       }
//       const invoice = {
//         count: 99,
//       }

//       const client = {
//         ..._client,
//         ...customFields,
//         company: appState?.appState.selectedClientCompanyName,
//       }

//       const c = template({ client, task, invoice })
//       console.log(c)
//       setNewContent(c)
//     } else {
//       // setTimeout(() => {
//       //   editor
//       //     ?.chain()
//       //     .focus()
//       //     .setContent(appState?.appState.originalTemplate as string)
//       //     .run()
//       // })
//     }
//   }, [
//     appState?.appState.selectedClient,
//     appState?.appState.selectedClientCompanyName,
//   ])
//   // console.log(content)

//   return appState?.appState.readOnly &&
//     content &&
//     appState?.appState.selectedClient ? (
//     <ReadonlyEditorInterface
//       settings={settings}
//       token={token}
//       content={content}
//     />
//   ) : (
//     <EditorInterface settings={settings} token={token} />
//   )
// }
