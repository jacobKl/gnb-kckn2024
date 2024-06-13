import React from 'react'
import { faMapPin, faList, faClipboard, faCar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SCREENS = [
    {
        text: "Zaplanuj podróż",
        icon: faMapPin,
        screen: 0
    },
    {
        text: "Wszystkie linie",
        icon: faList,
        screen: 1
    },
    {
        text: "Rozkład jazdy",
        icon: faClipboard,
        screen: 2
    },
    {
        text: localStorage.getItem("user_car") == null ? "Dodaj dane samochodu" : "Edytuj dane samochodu",
        icon: faCar
    }
];

function ScreenNav({ setScreen, screen, setCMActive }) {
  return (
    <div className="screen-nav bg-white flex justify-center items-center gap-10 h-[70px] dark:bg-gray-800 text-gray-400">

      {SCREENS.map(single => (
        <div className={`flex flex-col cursor-pointer max-w-[120px] ${screen == single.screen ? 'text-gray-600' : ''}`} onClick={() => setScreen(single.screen)}>
            <FontAwesomeIcon icon={single.icon} />
            <span className="text-xs mt-1">{single.text}</span>
        </div>
      ))}

      <div className='carmanager-button fixed z-10 flex cursor-pointer font-semibold bottom-4 right-3 p-2 rounded-lg bg-accent-500 text-white' onClick={() => setCMActive(true)}>
        <span className="text-xs m-1">{localStorage.getItem("user_car") == null ? "Dodaj dane samochodu" : "Edytuj dane samochodu"}</span>
        <FontAwesomeIcon icon={faCar} className='m-1' />
      </div>
    </div>
  )
}

export default ScreenNav
