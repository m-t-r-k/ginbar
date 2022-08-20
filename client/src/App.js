import './App.css';
import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import HowToTaste from "./components/HowToTaste/HowToTaste";
import Gins from "./components/Listing/Gins";
import GinDetail from "./components/Detail/Gin";
import CocktailDetail from "./components/Detail/Cocktail";

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
          <div className="container">
            <Switch>
              <Route path="/" element={<Home />} />
              <Route path="/how-to-taste/" element={<HowToTaste />} />
              <Route path="/gins/" element={<Gins />} />
              <Route path="/cocktails/" element={<Gins />} />
              <Route path="/gins/:ginId" element={<GinDetail />} />
              <Route path="/cocktails/:cocktailId" element={<CocktailDetail />} />
            </Switch>
          </div>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
