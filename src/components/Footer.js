import { Link } from "react-router-dom";

import './style/Footer.css'


export default function Footer() {
  return (
    <footer className="footer_content">
      <i className="fa fa-facebook-official w3-hover-opacity"></i>
      <i className="fa fa-instagram w3-hover-opacity"></i>
      <i className="fa fa-snapchat w3-hover-opacity"></i>
      <i className="fa fa-pinterest-p w3-hover-opacity"></i>
      <i className="fa fa-twitter w3-hover-opacity"></i>
      <i className="fa fa-linkedin w3-hover-opacity"></i>
      <p className="w3-medium">Developed by Sérgio Pinto in MERN stack (react.js, node.js and mongodb)</p>
    </footer>
  );
}


