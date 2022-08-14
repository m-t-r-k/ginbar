import React from "react";
import { withRouter } from "react-router-dom";
  
class Gin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: ""};
    }

    componentDidMount() {
        const ginId = this.props.match.params.ginId;
        this.fetchData(ginId);
    }

    fetchData = ginId => {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => data.filter(data => data.id == ginId))
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

export default withRouter(Gin);