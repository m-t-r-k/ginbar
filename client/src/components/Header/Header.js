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

  const locationHome = location.pathname === '/' ? "dark" : ""
  let mobileNavActive = activeMobileNav ? "activeNav" : ""
  let headerClasses = `${locationHome} ${mobileNavActive}`

  useEffect(() => {
    mobileNavActive = activeMobileNav ? "activeNav" : ""
    headerClasses = `${locationHome} ${mobileNavActive}`
  }, [activeMobileNav]);

  return (
    <header className={headerClasses}>
      <div className="navWrap clearfix">
        <div className="navigation">
          <div className="logo">
            <NavLink to="/">
              <svg width="30px" height="45px" viewBox="0 0 30 45" version="1.1">
                  <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="logo" transform="translate(-240.000000, -278.000000)" fill="#000000" fillRule="nonzero">
                          <path d="M261.16,294.36 C263.960014,294.36 266.033327,295.259991 267.38,297.06 C268.726673,298.86 269.4,301.119986 269.4,303.84 C269.4,310.986702 266.77336,314.56 261.52,314.56 L256.44,314.56 L256.44,322.36 L252.04,322.36 L252.04,306.04 L251.9325,306.0875 C251.7975,306.1425 251.580002,306.22 251.28,306.32 C250.879998,306.453334 250.446669,306.56 249.98,306.64 C249.513331,306.72 249,306.76 248.44,306.76 C246.946659,306.76 245.560006,306.480003 244.28,305.92 C243,305.359997 241.966671,304.480006 241.18,303.28 C240.393329,302.079994 240,300.586676 240,298.8 L240,286.24 C240,284.373324 240.299997,282.873339 240.9,281.74 C241.5,280.606661 242.359994,279.693337 243.48,279 C244.653339,278.33333 246.093325,278 247.8,278 C249.88001,278 251.759992,278.439996 253.44,279.32 L252.12,283.28 C251.399996,283.013332 250.773336,282.826667 250.24,282.72 C249.706664,282.613333 249.120003,282.56 248.48,282.56 C247.199994,282.56 246.200004,282.793331 245.48,283.26 C244.759996,283.726669 244.4,284.599994 244.4,285.88 L244.4,298.88 C244.4,300.160006 244.739997,301.053331 245.42,301.56 C246.100003,302.066669 247.093327,302.32 248.4,302.32 C249.413338,302.32 250.27333,302.073336 250.98,301.58 C251.68667,301.086664 252.04,300.200006 252.04,298.92 L252.04,298.56 L249.76,298.56 L248.36,294.36 L261.16,294.36 Z M256.44,310.36 L260.2,310.36 C261.720008,310.36 262.83333,310.02667 263.54,309.36 C264.24667,308.69333 264.666666,307.940004 264.8,307.1 C264.933334,306.26 265,305.200006 265,303.92 C265,302.50666 264.806669,301.420004 264.42,300.66 C264.033331,299.899996 263.48667,299.393335 262.78,299.14 C262.07333,298.886665 261.160006,298.76 260.04,298.76 L256.44,298.76 L256.44,310.36 Z" id="Combined-Shape"></path>
                      </g>
                  </g>
              </svg>
            </NavLink>
          </div>
          <nav className="clearfix">
            <NavLink to="/how-to-taste/" onClick={toggleNav}>How to Taste</NavLink>
            <NavLink to="/gins/" onClick={toggleNav}>Gin Empfehlungen</NavLink>
            <NavLink to="/imprint/" className={"imprint"} onClick={toggleNav}>Impressum</NavLink>
          </nav>
          <div className="mobileNavWrap" onClick={toggleNav}>
            <div className="mobileNav">
              <span className="st"></span>
              <span className="nd"></span>
              <span className="rd"></span>
            </div>
          </div>
        </div>
      </div>
   </header>
  );
}

export default Header;