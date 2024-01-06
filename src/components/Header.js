import {Link} from "react-router-dom";

import Navbar from './NavBar';
import './style/Header.css'


export default function Header() {
    return (
        <header>
            <div className="header-content">
                    <div className="header-nav">
                        <Navbar/>
                    </div>
            </div>
        </header>
    );
}





