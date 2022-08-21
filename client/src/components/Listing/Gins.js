import React from "react";
import { Link } from "react-router-dom";
import FlexBoxSection from "../FlexBoxSection/FlexBoxSection";
  
class Listing extends React.Component {
    state = {
      gins: []
    }

    componentDidMount() {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => this.setState({ gins: data }));
        console.log(this.state.gins);
    }

    render() {
        return (
            <div>
                <h1>Gins</h1>
                <FlexBoxSection gins={this.state.gins}></FlexBoxSection>
            </div>
        );
    }
}

export default Listing;