import React from "react";
import { NavLink } from "react-router-dom";
  
function Header() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink> |{" "}
        <NavLink to="/how-to-taste/">How to Taste</NavLink> |{" "}
        <NavLink to="/gins/">Gins</NavLink> |{" "}
        <NavLink to="/cocktails/">Cocktails</NavLink>
      </nav>
    </div>
  );
}

export default Header;