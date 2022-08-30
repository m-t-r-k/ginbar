import './App.scss';
import './components/scss/_globals.scss';
import React, { setState, useEffect } from "react";
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  render() {

    setTimeout(() => {
      this.setState({loaded: true});
      console.log("Loading done");
    }, 4000)

    return (
      <div className={this.state.loaded ? "App" : "App fixed"}>
        <SplashScreen loaded={this.state.loaded}></SplashScreen>
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
      </div>
    );
  }
}
export default App;
