import { Switch } from '@/components/Forms/Switch'
import { useAppState } from '@/hooks/useAppState'

const DisplayTasksToggle = () => {
  const appState = useAppState()

  const handleClick = () => {
    appState?.toggleDisplayTasks()
    appState?.toggleChangesCreated(true)
  }

  return (
    <div className='py-600 px-500 border-1 border-b relative flex justify-between p-4 gap-3 z-0 items-center'>
      <p className='font-medium'>Display Tasks</p>
      <div className='gap-3'>
        <Switch
          value={!!appState?.appState.displayTasks}
          onChange={handleClick}
        />
      </div>
    </div>
  )
}

export default DisplayTasksToggle
