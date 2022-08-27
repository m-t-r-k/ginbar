import React from "react";
import { Link } from "react-router-dom";
import './Gins.scss';
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import MasonryLayout from "../../MasonryLayout/MasonryLayout";
  
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
            <section className="pageWrapper">
                <HeadlineTextEmphesized
                headline={"Gin Auswahl"}
                text={""}
                ></HeadlineTextEmphesized>
                <MasonryLayout gins={this.state.gins}></MasonryLayout>
            </section>
        );
    }
}

export default Listing;