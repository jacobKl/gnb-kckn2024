import React from 'react'
import { faMapPin, faList, faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ScreenNav({ setScreen, screen }) {
  return (
    <div className="bg-white flex justify-center items-center gap-10 h-[70px] dark:bg-gray-800 text-gray-400">
      <div className={`flex flex-col cursor-pointer max-w-[120px] ${screen == 0 ? 'text-white' : ''}`} onClick={() => setScreen(0)}>
        <FontAwesomeIcon icon={faMapPin} />
        <span className="text-xs mt-1">Zaplanuj podróż</span>
      </div>
      <div className={`flex flex-col cursor-pointer max-w-[120px] ${screen == 1 ? 'text-white' : ''}`} onClick={() => setScreen(1)}>
        <FontAwesomeIcon icon={faList} />
        <span className="text-xs mt-1">Wszystkie linie</span>
      </div>
      <div className={`flex flex-col cursor-pointer max-w-[120px] ${screen == 2 ? 'text-white' : ''}`} onClick={() => setScreen(2)}>
        <FontAwesomeIcon icon={faClipboard} />
        <span className="text-xs mt-1">Rozkład jazdy</span>
      </div>
    </div>
  )
}

export default ScreenNav
