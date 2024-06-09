import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

function CarManager() {

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
        displayCM(false);
    }

    const closeWindow = () => {
        //displayCM(false);
    }

    return (
        <div className='carmanager bg-white'>
            <button onClick={closeWindow}><FontAwesomeIcon icon={faXmark} /></button>
            <form action="post" onSubmit={saveCarInfo}>
                <h2>Pojemność silnika:</h2>
                <input type="number" step={0.1} name="displacement" id="displacement" />
                <h2>Średnie spalanie:</h2>
                <input type="number" step={0.1} name="consumption" id="consumption" />
                <input type="submit" value="Zatwierdź" />
            </form>
        </div>
    )
}

export default CarManager