import React from 'react'
import { faMapPin, faList, faClipboard, faCar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CarManager from './CarManager'

function ScreenNav({ setScreen, screen, setCMActive }) {
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
      <div className='fixed z-10 flex cursor-pointer font-semibold bottom-4 right-3 p-2 rounded-lg bg-accent-500 text-white' onClick={() => setCMActive(true)}>
        <span className="text-xs m-1">{localStorage.getItem("user_car") == null ? "Dodaj dane samochodu" : "Edytuj dane samochodu"}</span>
        <FontAwesomeIcon icon={faCar} className='m-1' />
      </div>
    </div>
  )
}

export default ScreenNav
