import React from 'react'
import { faWarning } from '@fortawesome/free-solid-svg-icons'


function Error({error}) {
  return (
    <div className="loader bg-white flex items-center justify-center">
        <div className="text-3xl text-gray-500">
            <FontAwesomeIcon icon={faWarning} />
            <p>{error}</p>
        </div>
    </div>
  )
}

export default Error
