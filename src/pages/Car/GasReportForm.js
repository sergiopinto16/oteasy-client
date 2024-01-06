import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './GasReportForm.css'
import { Navigate } from "react-router-dom";


import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../UserContext";

import config from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '


export default function CreateReport() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }


    const [car_plate, setCarPlate] = useState('CORSA | 82-RB-05');
    const [car_km, setKmCar] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [redirect, setRedirect] = useState(false);


    async function addGasReport(ev) {
        ev.preventDefault();

        if (!window.confirm('Are you sure?')) {
            return;
        }

        const response = await fetch(api_host + '/api/gas/add', {
            method: 'POST',
            body: JSON.stringify({ car_plate, car_km, quantity, price }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {

            alert('error adding to db - ' + response);
        }
    }

    if (redirect) {
        return <Navigate to={'/gas/gasReports'} />
    }


    return (
        <form onSubmit={addGasReport} >

            <div className="input">
                <label htmlFor="cars">Choose a car:</label>
                <select name="cars" id="cars"
                    value={car_plate}
                    onChange={ev => setCarPlate(ev.target.value)}>
                    <option value="CORSA | 82-RB-05">CORSA | 82-RB-05</option>
                    <option value="SMART | 49-PT-83">SMART | 49-PT-83</option>
                </select>
                <br></br>
            </div>
            {/* <input type="car_plate"
                placeholder={'Car license plate'}
                value={car_plate}
                onChange={ev => setCarPlate(ev.target.value)} /> */}
            <div className="input">
                <label htmlFor="km">Insert car kilometers:</label>
                <input type="number" name="km"
                    placeholder={'kilometers'}
                    value={car_km}
                    onChange={ev => setKmCar(ev.target.value)} />
            </div>
            <div className="input">
                <label htmlFor="liters">Insert bomb liters added:</label>
                <input type="number"
                    placeholder={'bomb liters'}
                    value={quantity}
                    onChange={ev => setQuantity(ev.target.value)} />
            </div >
            <div className="input">
                <label htmlFor="price">Insert gas price:</label>
                <input type="number"
                    placeholder={'gas price'}
                    value={price}
                    onChange={ev => setPrice(ev.target.value)} />
            </div >
            <button style={{ marginTop: '5px' }}>Add Gas Report</button>
        </form >
    );
}