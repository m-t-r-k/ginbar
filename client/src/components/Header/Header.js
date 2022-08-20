import React from "react";
import { NavLink } from "react-router-dom";
import './Header.scss';
  
function Header() {

  return (
    <header>
      <nav className="clearfix">
          <NavLink to="/">Home</NavLink><span></span>
          <NavLink to="/how-to-taste/">How to Taste</NavLink><span></span>
          <NavLink to="/gins/">Gin Auswahl</NavLink><span></span>
          <NavLink to="/cocktails/">Gin Cocktails</NavLink>
        </nav> 
   </header>
  );
}

export default Header;