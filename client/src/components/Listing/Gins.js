import React from "react";
import { Link } from "react-router-dom";
import FlexBoxSection from "../FlexBoxSection/FlexBoxSection";
import MasonryLayout from "../MasonryLayout/MasonryLayout";
  
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
                <MasonryLayout gins={this.state.gins}></MasonryLayout>
            </div>
        );
    }
}

export default Listing;