import './App.scss';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AnimatedRoutes from './components/AnimatedRouts';

const App = () => {
  return (
    <div className={"App"}>
      <Router>
        <Header></Header>
        <AnimatedRoutes></AnimatedRoutes>
        <Footer></Footer>
      </Router>
      <script id="CookieDeclaration" src="https://consent.cookiebot.com/dc9e906e-0fae-47ce-b334-6852f3d86061/cd.js" type="text/javascript" async></script>
    </div>
  );
}

export default App;
