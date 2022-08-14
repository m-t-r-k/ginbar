import logo from './logo.svg';
import './App.css';
import React from "react"

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1>Hello {this.state.name}!</h1>
          </a>
        </header>
      </div>
    );
  }
}

export default App;
