import {useContext, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {UserContext} from "../../UserContext";
import './style.css';
import {TextField, Button} from "@material-ui/core";


import config from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '


export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    async function onButtonClick(ev) {
        ev.preventDefault();
        const response = await fetch(api_host + '/api/user/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });

        console.log(response)
        if (response.ok) {
            response.json().then(userInfo => {
                console.log(userInfo);
                // console.log(userInfo.token)
                // localStorage.setItem('userInfo', userInfo.token);

                console.log("Redirect to home page!")
                window.location.replace("/");
                // setRedirect(true);

            });
        } else {
            //TODO - add not email registed, ...
            // console.log(response)
            if (response.status === 401) {
                alert('Please confirm email')
            } else {
                alert('wrong credentials');
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log('do validate')
            onButtonClick(event)
        }
    }

    const navigate = useNavigate();


    if (redirect) {
        return <Navigate to={'/'}/>
    }


    // return (
    //   <form className="login" onSubmit={onButtonClick}>
    //     <h1>Login</h1>
    //     <input type="email" placeholder="Email" value={email}
    //            onChange={ev => setEmail(ev.target.value)} />
    //     <input type="password" placeholder="Password" value={password}
    //            onChange={ev => setPassword(ev.target.value)} />
    //     <button type="submit">Login</button>
    //   </form>
    // );

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Login</div>
            </div>
            <br/>
            <div className={"inputContainer"}>
                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email here"
                    onChange={ev => setEmail(ev.target.value)}
                    className={"inputBox"}/>
                <label className="errorLabel">{emailError}</label>
            </div>
            <br/>
            <div className={"inputContainer"}>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter your password here"
                    onChange={ev => setPassword(ev.target.value)}
                    className={"inputBox"}
                    onKeyDown={handleKeyDown}/>
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br/>
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"}/>
            </div>
        </div>
    );
}