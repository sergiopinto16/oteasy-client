import './RegisterPage.css'

import config from './../../config/config.json';

import {useContext, useEffect, useState, useRef} from "react";
import {UserContext} from "../../UserContext";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useNavigate } from "react-router-dom";


const api_host = config.api.host
//' + api_host + ':' + api_port + '

// TODO: how to get user id

export default function RegisterPage() {
    const {userInfo, setUserInfo} = useContext(UserContext);

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }


    const [cardId, setCardId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // const [birdYear, setBirdYear] = useState('');
    // const [birdMonth, setBirdMonth] = useState('');
    // const [birdDay, setBirdDay] = useState('');
    const [birthDate, setBirthDate] = useState('')
    const [parentName, setParentName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [doctor, setDoctor] = useState('');
    const [address, setAddress] = useState('');

    const current = new Date().toISOString().split("T")[0]
    const navigate = useNavigate();

    async function register_client(ev) {
        ev.preventDefault();

        if (cardId.length === 0 ||
            name.length === 0 ||
            email.length === 0 ||
            birthDate.length === 0 ||
            parentName.length === 0 ||
            contactNumber.length === 0 ||
            address.length == 0) {
            console.log("Fields not OK")
            alert("Fields not OK")
            return
        }

        const response = await fetch(api_host + '/api/client/register', {
            method: 'POST',
            body: JSON.stringify({
                card_id: cardId, name, email,
                birth_date: birthDate,
                address: address,
                parent_name: parentName,
                contact_number: contactNumber
            }),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });


        if (response.status === 200) {
            alert('Registration successful');

            navigate("/client/clients");
        } else {
            alert('BD - registration failed');
        }
    }


    return (
        <form className="register" onSubmit={register_client}>
            <h1>CLIENT Register</h1>

            <div className="div_input">
                <span className="span_input_name">Name:</span>
                <input className="span_input_value" type="text"
                       placeholder="name"
                       value={name}
                       onChange={ev => setName(ev.target.value)}/>
            </div>
            <div className="div_input">
                <span className="span_input_name"> email: </span>
                <input className="span_input_value" type="email"
                       placeholder="email"
                       value={email}
                       onChange={ev => setEmail(ev.target.value)}/>
            </div>
            <div className="div_input">
                <span className="span_input_name">CardID:</span>
                <input className="span_input_value" type="number"
                       placeholder="card ID"
                       value={cardId}
                       onChange={ev => setCardId(ev.target.value)}/>
            </div>

            <div className="div_input">
                <span className="span_input_name">Bird year:</span>
                <input className="span_input_value" type='date'
                       placeholder='BirthDate'
                       value={birthDate}
                       onChange={ev => setBirthDate(ev.target.value)}
                       name='birthdate'
                       max={current}
                />
            </div>



            <div className="div_input">
                <span className="span_input_name">Address:</span>
                <input className="span_input_value" type="text"
                       placeholder="Address"
                       value={address}
                       onChange={ev => setAddress(ev.target.value)}/>
            </div>

            <div className="div_input">
                <span className="span_input_name">Parent Name:</span>
                <input className="span_input_value" type="text"
                       placeholder="Parent Name"
                       value={parentName}
                       onChange={ev => setParentName(ev.target.value)}/>
            </div>
            <div className="div_input">
                <PhoneInput className="span_input_value"
                            placeholder="Enter phone number"
                            value={contactNumber}
                            onChange={setContactNumber}/>
            </div>
            <div className="div_button">
                <button className="btn_register" >Register</button>
            </div>
        </form>
    );
}