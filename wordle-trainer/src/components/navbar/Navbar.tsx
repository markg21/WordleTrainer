import {
  CogIcon,
} from '@heroicons/react/outline'

type Props = {
  setIsSettingsModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsSettingsModalOpen,
}: Props) => {
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex h-6 w-6"/>
        <p className="text-xl font-bold dark:text-white">{"Wordle Trainer"}</p>
        <div className="right-icons">
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
