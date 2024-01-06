import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../UserContext";
import './style/NavBar.css'
import {Navigate} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';


import config from './../config/config.json';
// const config = require('config');

const api_host = config.api.host
//' + api_host + ':' + api_port + '


const spm_credentials = 0
const gas_report_credentials = 1

const Navbar = () => {

    const {userInfo, setUserInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Dont understand how information change this userInfo
    // useEffect(() => {
    //     let userToken = localStorage.getItem("userInfo")
    //     console.log("useEffect NavBar token = " + userToken)

    //     //TODO cehck if ok in api

    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {

            // let userToken = localStorage.getItem("userInfo")
            // console.log("useEffect LeftNavBar token = " + userToken)

            // const response = await fetch(api_host + '/api/user/profile', {
            //     method: 'POST',
            //     body: JSON.stringify({ "token": userToken }),
            //     headers: { 'Content-Type': 'application/json' },
            //     credentials: 'include',
            // });
            const response = await fetch(api_host + '/api/user/profile', {
                credentials: 'include',
            });
            //TODO cehck if ok in api
            console.log(response)
            if (response.ok) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                    console.log('useEffect LeftNavBarNo SetUser')

                });
            } else {
                setUserInfo({})
                console.log('useEffect LeftNavBarNo profile')
            }
        }
        const response = fetchData().catch(console.error);
        console.log(response)


        // setUserInfo(localStorage.getItem("userInfo"))

        // console.log("LeftNavBar UserInfo = " + userInfo)
        // console.log("LeftNavBar UserInfo.token = " + userInfo.token)
    }, []);


    //     const response = fetch(api_host + '/api/user/profile', {
    //         method: 'POST',
    //         body: JSON.stringify({ "token": userToken }),
    //         headers: { 'Content-Type': 'application/json' },
    //         credentials: 'include',
    //     });
    //     console.log(response)
    //     console.log(response.ok)
    //     if (response.ok) {
    //         response.json().then(userInfo => {
    //             setUserInfo(userInfo);
    //         });
    //     }
    //     else {
    //         setUserInfo({})
    //         console.log('useEffect NavBar No profile')
    //     }

    //     // setUserInfo(localStorage.getItem("userInfo"))

    //     // console.log("NavBar UserInfo = " + userInfo)
    //     // console.log("NavBar UserInfo.token = " + userInfo.token)
    // }, []);

    const email = userInfo?.email;
    console.log("NavBar.js | email =" + email)
    const name = userInfo?.name;
    console.log("NavBar.js | name = " + name)
    const credentials_level = userInfo?.credentials_level;
    console.log("NavBar.js | credentials_level =" + credentials_level)


    async function logout(ev) {
        ev.preventDefault();
        console.log("NavBar Logout email = ", email)
        const response = await fetch(api_host + '/api/user/logout', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({'email': email}),
            headers: {'Content-Type': 'application/json'},
        }).catch(console.error);

        // setUserInfo({});
        // console.log("Remove item from localStorage = " +localStorage.getItem("userInfo"))
        // localStorage.removeItem("userInfo");
        // console.log("Item removed = " + localStorage.getItem("userInfo"))
        window.location.replace("/");
        // setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    function hamburger_button_click(ev){
        if(showMobileMenu){
            setShowMobileMenu(!showMobileMenu)
        }
    }

    return (
        <nav>

            <div className={'nav-bar'}>
                <div className={'left-navbar'}>

                    <div className={`left-navbar-hidden ${showMobileMenu ? 'show-mobile-menu' : ''}`}>

                        <div className="mobile-left-navbar">

                            <button type="button" className="mobile-toggler"
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}>X
                            </button>

                        </div>

                        <div className="navbar-element">
                            <Link to="/" className="logo">VeSiTO</Link>
                        </div>

                        {/* SPMs | Clients */}
                        {email && credentials_level !== undefined && (
                            <>
                                {credentials_level[spm_credentials] === 1 && (
                                    <>
                                        <div className="navbar-element">
                                            <Dropdown>
                                                <Dropdown.Toggle className="navbar-element-link"
                                                                 variant="success">SPMs</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item> <Link className="navbar-element-link"
                                                                          to="/spm/spm-casa/0"
                                                                          onClick={hamburger_button_click}>SPM
                                                        Casa</Link></Dropdown.Item>
                                                    <Dropdown.Item> <Link className="navbar-element-link"
                                                                          to="/spm/spm-escola/0"
                                                                          onClick={hamburger_button_click}>SPM
                                                        Escola</Link></Dropdown.Item>
                                                    <Dropdown.Item> <Link className="navbar-element-link"
                                                                          to="/spm/spm-pcasa/0"
                                                                          onClick={hamburger_button_click}>SPM-p
                                                        Casa</Link></Dropdown.Item>
                                                    <Dropdown.Item><Link className="navbar-element-link"
                                                                         to="/spm/spm-pescola/0"
                                                                         onClick={hamburger_button_click}>SPM-p
                                                        Escola</Link></Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>

                                        {/* Clientes */}
                                        <div className="navbar-element">
                                            <Link className="navbar-element-link"
                                                  to="/client/clients"
                                                  onClick={hamburger_button_click}>Clients</Link>
                                        </div>
                                    </>)}
                            </>
                        )}
                        {/* Gas Reports */}
                        {
                            email && credentials_level !== undefined && (
                                <>
                                    {credentials_level[gas_report_credentials] === 1 && (
                                        <>
                                            <div className="navbar-element">
                                                <Link className="navbar-element-link"
                                                      to="/gas/gasReports"
                                                      onClick={hamburger_button_click}>Gas Reports</Link>
                                            </div>
                                        </>)}
                                </>
                            )
                        }
                    </div>

                    <div className="mobile-left-navbar">

                        <button type="button" className="mobile-toggler"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}>H
                        </button>

                    </div>

                </div>


                <div className={'right-navbar'}>
                    {
                        email && (
                            <div className="navbar-element">
                                {/* <Link to="/create">Create new post</Link> */}
                                <a className={"navbar-element-link"} onClick={logout}> Logout ({name})</a>
                            </div>
                        )
                    }
                    {
                        !email && (
                            <>
                                <div className={"navbar-element"}>
                                    <Link className={"navbar-element-link"} to="/login">Login</Link>
                                </div>
                                <div className={"navbar-element"}>
                                    <Link className={"navbar-element-link"} to="/register">Register</Link>
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
