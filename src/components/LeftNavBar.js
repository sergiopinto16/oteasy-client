import {Link} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../UserContext";

import './style/LeftNavBar.css'


import config from './../config/config.json';
// const config = require('config');

const api_host = config.api.host

const spm_credentials = 0
const gas_report_credentials = 1

const LeftNavBar = () => {

    const {userInfo, setUserInfo} = useContext(UserContext);
    const [showMobileMenu, setShowMobileMenu] = useState(false);


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


    const email = userInfo?.email;
    console.log("NavBar.js | email =" + email)
    const name = userInfo?.name;
    console.log("NavBar.js | name = " + name)
    const credentials_level = userInfo?.credentials_level;
    console.log("NavBar.js | credentials_level =" + credentials_level)


    return (
        <nav>

            <div className={'left-navbar'}>

                <div className={`left-navbar-hidden ${showMobileMenu ? 'show-mobile-menu' : ''}`}>
                <div className="left-navbar-element">
                    <Link to="/" className="logo">VeSiTO</Link>
                </div>

                {/* SPMs | Clients */}
                {email && credentials_level !== undefined && (
                    <>
                        {credentials_level[spm_credentials] === 1 && (
                            <>
                                <div className="left-navbar-element">
                                    <Dropdown>
                                        <Dropdown.Toggle className="left-navbar-element-link"
                                                         variant="success">SPMs</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item> <Link className="left-navbar-element-link"
                                                                  to="/spm/spm-casa/0">SPM Casa</Link></Dropdown.Item>
                                            <Dropdown.Item> <Link className="left-navbar-element-link"
                                                                  to="/spm/spm-escola/0">SPM
                                                Escola</Link></Dropdown.Item>
                                            <Dropdown.Item> <Link className="left-navbar-element-link"
                                                                  to="/spm/spm-pcasa/0">SPM-p
                                                Casa</Link></Dropdown.Item>
                                            <Dropdown.Item><Link className="left-navbar-element-link"
                                                                 to="/spm/spm-pescola/0">SPM-p
                                                Escola</Link></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Clientes */}
                                <div className="left-navbar-element">
                                    <Link className="left-navbar-element-link" to="/client/clients">Clients</Link>
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
                                    < div className="left-navbar-element">
                                        <Link className="left-navbar-element-link" to="/gas/gasReports">Gas Reports</Link>
                                    </div>
                                </>)}
                        </>
                    )
                }
                </div>

                <div className="mobile-left-navbar">

                    <button type="button" className="mobile-toggler"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}>hamburger button
                    </button>

                </div>

            </div>


        </nav>
    );
}


export default LeftNavBar

