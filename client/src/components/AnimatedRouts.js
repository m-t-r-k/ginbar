import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import HowToTaste from "./Pages/HowToTaste/HowToTaste";
import Gins from "./Pages/Gins/Gins";
import GinDetail from "./Pages/Gin/Gin";
import GinTypes from "./Pages/GinTypes/GinTypes";
import BarMenu from "./Pages/BarMenu/BarMenu";
import Imprint from "./Pages/Imprint/Imprint";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/gin-types/" element={<GinTypes />} />
        <Route path="/how-to-taste/" element={<HowToTaste />} />
        <Route path="/gins/" element={<Gins />} />
        <Route path="/gins/:ginId" element={<GinDetail />} />
        <Route path="/bar-menu/" element={<BarMenu />} />
        <Route path="/imprint/" element={<Imprint />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;