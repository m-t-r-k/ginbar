import React, { useState, useEffect }from "react";
import { NavLink } from "react-router-dom";
import './Header.scss';
import { useLocation } from "react-router-dom";
  
function Header(darkHeader) {

  const location = useLocation();

  const [activeMobileNav, setActiveMobileNav] = useState(false)
  const toggleNav = event => {
    setActiveMobileNav(current => !current);
  };

  const locationHome = location.pathname == '/' ? "dark" : ""
  let mobileNavActive = activeMobileNav ? "activeNav" : ""
  let headerClasses = `${locationHome} ${mobileNavActive}`

  useEffect(() => {
    mobileNavActive = activeMobileNav ? "activeNav" : ""
    headerClasses = `${locationHome} ${mobileNavActive}`
  }, [activeMobileNav]);

  return (
    <header className={headerClasses}>
      <div className="navWrap">
        <div className="logo"></div>
        <nav className="clearfix">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/how-to-taste/">How to Taste</NavLink>
          <NavLink to="/gins/">Gin Auswahl</NavLink>
          <NavLink to="/cocktails/">Gin Cocktails</NavLink>
        </nav>
        <div className="mobileNavWrap" onClick={toggleNav}>
          <div className="mobileNav">
            <span className="st"></span>
            <span className="nd"></span>
            <span className="rd"></span>
          </div>
        </div>
      </div>
   </header>
  );
}

export default Header;