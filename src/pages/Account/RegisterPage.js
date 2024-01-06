import {useState} from "react";
import './style.css'

import config from './../../config/config.json';
import PasswordAndConfirmPasswordValidation
    from "./password-and-confirm-passsord-validation/PasswordAndConfirmPasswordValidation"
import {Navigate} from "react-router-dom";

const api_host = config.api.host
//' + api_host + ':' + api_port + '


export default function RegisterPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [redirect, setRedirect] = useState(false);
    let passwordOK = false;
    let password = "";

    const setPassword = (res, value) => {
        console.log(res + " | Password = " + value)
        passwordOK = res;
        password = value;
    }


    async function register(ev) {
        ev.preventDefault();

        console.log(name.length);
        console.log(email.length);
        console.log(passwordOK)
        console.log(password)

        if (name.length === 0 || email.length === 0 || !passwordOK || password.length === 0) {
            console.log("Fields not OK")
            alert("Fields not OK")
        } else {
            fetch(api_host + '/api/user/register', {
                method: 'POST',
                body: JSON.stringify({name, email, password}),
                headers: {'Content-Type': 'application/json'},
            }).then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw new Error(response.response)
            }).then((responseJson) => {
                //console.log(responseJson)
                alert('Registration successful');
                console.log("Redirect to home page!")
                window.location.replace("/login");
            }).catch((error) => {
                alert(error);
            });
        }
    }

    //
    // return (
    //   <form className="register" onSubmit={register}>
    //     <h1>Register</h1>
    //     <input type="text"
    //       placeholder="name"
    //       value={name}
    //       onChange={ev => setName(ev.target.value)} />
    //     <input type="email"
    //       placeholder="email"
    //       value={email}
    //       onChange={ev => setEmail(ev.target.value)} />
    //     <PasswordAndConfirmPasswordValidation callbackPasswordFunction={setPassword} />
    //
    //     <button>Register</button>
    //   </form>
    // );

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Register</div>
            </div>
            <br/>
            <div className={"inputContainer"}>
                <input
                    type="text"
                    value={name}
                    placeholder="Enter your name here"
                    onChange={ev => setName(ev.target.value)}
                    className={"inputBox"}/>
            </div>
            <br/>
            <div className={"inputContainer"}>
                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email here"
                    onChange={ev => setEmail(ev.target.value)}
                    className={"inputBox"}/>
            </div>
            <br/>

            <PasswordAndConfirmPasswordValidation callbackPasswordFunction={setPassword}/>

            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={register}
                    value={"Register"}/>
            </div>
        </div>
    );


}