import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

function CarManager({ setCMActive }) {

    useEffect(() => {
        if (localStorage.getItem("user_car") != null) {
            document.getElementById("displacement").value = JSON.parse(localStorage.getItem("user_car")).displacement
            document.getElementById("consumption").value = JSON.parse(localStorage.getItem("user_car")).consumption
        }

    })

    const saveCarInfo = (e) => {
        e.preventDefault();
        let formdata = new FormData(e.target);
        console.log(formdata.get("displacement"));
        let userCar = { displacement: formdata.get("displacement"), consumption: formdata.get("consumption") }
        localStorage.setItem("user_car", JSON.stringify(userCar))
        setCMActive(false);
    }

    const closeWindow = () => {
        setCMActive(false)
    }

    return (
        <div className='carmanager bg-primary-500 rounded-3xl text-white flex justify-end flex-col min-w-96'>
            <div className='flex flex-row justify-between items-center p-3'>
                <span className='flex text-lg pl-2'>Podaj dane swojego samochodu:</span>
                <button className='rounded-full flex justify-center items-center bg-primary-100 w-10 h-10 aspect-ratio-1' onClick={closeWindow}><FontAwesomeIcon size="2x" icon={faXmark} /></button>
            </div>
            <div className='bg-primary-300 rounded-3xl p-8'>

                <form className='flex flex-col items-start' action="post" onSubmit={saveCarInfo}>
                    <h2 className=''>Pojemność silnika (l):</h2>
                    <input className='pl-2 text-lg my-2 w-full bg-[#7077A1] rounded-full' type="number" step={0.1} name="displacement" id="displacement" />
                    <h2 className=''>Średnie spalanie (l/100km):</h2>
                    <input className='pl-2 text-lg my-2 w-full bg-[#7077A1] rounded-full' type="number" step={0.1} name="consumption" id="consumption" />
                    <input className='block bg-accent-500 w-full mt-2 p-1 rounded-full cursor-pointer' type="submit" value="Zatwierdź" />
                </form>
            </div>
        </div>
    )
}

export default CarManager