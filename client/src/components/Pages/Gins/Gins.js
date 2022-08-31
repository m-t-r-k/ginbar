import React from "react";
import MotionWrapper from "../../MotionWrapper";
import './Gins.scss';
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import MasonryLayout from "../../MasonryLayout/MasonryLayout";
import GinData from '../../../data/gin-data.json';
  
class Listing extends React.Component {
    state = {
      gins: []
    }

    componentDidMount() {
        this.setState({ gins: GinData });
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <MotionWrapper>
                <section className="pageWrapper">
                    <HeadlineTextEmphesized
                    headline={"Unsere Gin Empfehlungen"}
                    text={""}
                    ></HeadlineTextEmphesized>
                    <MasonryLayout gins={this.state.gins}></MasonryLayout>
                </section>
            </MotionWrapper>
        );
    }
}

export default Listing;