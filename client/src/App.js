import './App.scss';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
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
