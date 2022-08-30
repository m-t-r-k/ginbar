import './App.scss';
import './components/scss/_globals.scss';
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Pages/Home/Home";
import HowToTaste from "./components/Pages/HowToTaste/HowToTaste";
import Gins from "./components/Pages/Gins/Gins";
import GinDetail from "./components/Pages/Gin/Gin";
import Imprint from "./components/Pages/Imprint/Imprint";
import SplashScreen from './components/SplashScreen/SplashScreen';

function App()  {
    const [done, setDone] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setDone(true);
      }, 4000);
    }, []);
  
    return (
      <div className="App">
        {!done ? (
        <SplashScreen></SplashScreen>
      ) : (
        <Router>
          <Header></Header>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-to-taste/" element={<HowToTaste />} />
              <Route path="/gins/" element={<Gins />} />
              <Route path="/cocktails/" element={<Gins />} />
              <Route path="/gins/:ginId" element={<GinDetail />} />
              <Route path="/imprint" element={<Imprint />} />
            </Routes>
            <Footer></Footer>
        </Router>
      )}
      </div>
    );
  }

export default App;
