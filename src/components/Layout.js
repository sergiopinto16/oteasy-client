import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";
import './style/Layout.css'

export default function Layout() {


    return (
        <main>
            <Header/>
            <div className="outlet-content">
                <Outlet/>
            </div>
            <Footer/>
        </main>
    );
}