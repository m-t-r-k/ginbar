import './App.scss';
import './components/scss/_globals.scss';
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SplashScreen from './components/SplashScreen/SplashScreen';
import AnimatedRoutes from './components/AnimatedRouts';
import GinData from './data/gin-data.json';

const App = () => {
  const [loaded, setLoaded] = useState(false);

  const cacheImages = async (srcArray) => {  
    const minTime = 4500;
    const beginTime = Date.now();
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
  
        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });

    await Promise.all(promises);

    const currentTime = Date.now() - beginTime;
    console.log(currentTime);
    const waittime = currentTime < minTime ? minTime - currentTime : 0;
    const timer = setTimeout(() => {
      setLoaded(true);
    }, waittime);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const path = "../images/";

    const imgs = GinData.map(gin => {
      return [path + gin.imageBottle, path + gin.imageMoodPic, path + gin.imageMoodPicSmall];
    }).flat();

    cacheImages(imgs)
  }, [])

  return (
    <div className={loaded ? "App" : "App fixed"}>
      <SplashScreen loaded={loaded}></SplashScreen>
      <Router>
        <Header></Header>
        {/*
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-to-taste/" element={<HowToTaste />} />
          <Route path="/gins/" element={<Gins />} />
          <Route path="/cocktails/" element={<Gins />} />
          <Route path="/gins/:ginId" element={<GinDetail />} />
          <Route path="/imprint" element={<Imprint />} />
        </Routes>
        */}
        <AnimatedRoutes></AnimatedRoutes>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
