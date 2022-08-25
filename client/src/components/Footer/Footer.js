import React from "react";
import { Link } from "react-router-dom";
import './Footer.scss';
import { useLocation } from "react-router-dom";
  
function Footer() {

    const location = useLocation();

    return (
        <footer className="full-width">
            <section className={location.pathname == '/' ? "footer-home" : ""}>
                <Link to={`/imprint`}>Impressum</Link>
            </section>                
        </footer>
    );
}

export default Footer;