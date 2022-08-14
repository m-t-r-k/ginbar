import React from "react";
import { Link } from "react-router-dom";
  
function Header() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/how-to-taste/">How to Taste</Link> |{" "}
        <Link to="/gins/">Gins</Link> |{" "}
        <Link to="/cocktails/">Cocktails</Link>
      </nav>
    </div>
  );
}

export default Header;