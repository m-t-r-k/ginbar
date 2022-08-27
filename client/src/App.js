import './App.scss';
import './components/scss/_globals.scss';
import React from "react"
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

class App extends React.Component {
  state = {
    name: ""
  }

  componentDidMount() {
    fetch("http://localhost:3000/gins")
      .then(res => res.json())
      .then(data => this.setState({ name: data.name }));
    console.log(this.state.name);
  }

  render() {
    return (
      <div className="App">
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
