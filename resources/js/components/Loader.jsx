import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


function Loader() {
  return (
    <div className="loader bg-white flex items-center justify-center">
        <div className="animate-spin text-3xl text-gray-500">
            <FontAwesomeIcon icon={faSpinner} />
        </div>
    </div>
  )
}

export default Loader
