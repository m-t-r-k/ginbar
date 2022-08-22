import React from "react";
import { NavLink } from "react-router-dom";
import './Header.scss';
import { useLocation } from "react-router-dom";
  
function Header(darkHeader) {

  const location = useLocation();

  return (
    <>
    <header className={location.pathname == '/' ? "dark" : ""}>
      <nav className="clearfix">
          <NavLink to="/">Home</NavLink><span></span>
          <NavLink to="/how-to-taste/">How to Taste</NavLink><span></span>
          <NavLink to="/gins/">Gin Auswahl</NavLink><span></span>
          <NavLink to="/cocktails/">Gin Cocktails</NavLink>
        </nav>
   </header>
   </>
  );
}

export default Header;