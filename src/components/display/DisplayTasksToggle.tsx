import { Switch } from '@/components/Forms/Switch'
import { When } from '@/components/hoc/When'
import { useAppState } from '@/hooks/useAppState'

const DisplayTasksToggle = () => {
  const appState = useAppState()

  const handleClick = () => {
    if (!appState?.appState.settings?.displayTasks) {
      if (appState?.appState.editor) {
        appState?.appState?.editor
          .chain()
          .focus()
          .setContent(
            `
               ${appState?.appState.originalTemplate}
      `,
          )
          .run()
      }
      appState?.setOriginalTemplate(
        appState?.appState.editor?.getHTML() as string,
      )
    }
    appState?.toggleDisplayTasks()
    appState?.toggleChangesCreated(true)
  }

  return (
    <div className='py-600 px-500 border-1 border-b relative flex justify-between p-4 gap-3 z-0 items-center'>
      <p className='font-medium'>Display Tasks</p>
      <div className='flex justify-center align-center gap-5'>
        <When condition={!!appState?.appState.displayTasks}>
          <button
            className='py-1 px-3 text-new-dark text-[13px] rounded bg-white border border-slate-300 scale-90'
            onClick={appState?.toggleNotificationsModal}
          >
            Customize
          </button>
        </When>
        <Switch
          value={!!appState?.appState.displayTasks}
          onChange={handleClick}
        />
      </div>
    </div>
  )
}

export default DisplayTasksToggle
