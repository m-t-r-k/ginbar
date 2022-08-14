import React from "react";
  
class Gin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: ""};
    }

    fetchData = ginId => {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => this.setState({ name: data.name }));
        console.log(this.state.name);
    };

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
            </div>
        );
    }
}

export default Gin;