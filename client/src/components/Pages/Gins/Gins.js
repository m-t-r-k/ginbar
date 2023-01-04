import React from "react";
import MotionWrapper from "../../MotionWrapper";
import './Gins.scss';
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import NoMasonryLayout from "../../noMasonryLayout/noMasonryLayout";
import GinData from '../../../data/gin-data.json';
  
class Listing extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const gins = GinData;
        return (
            <MotionWrapper>
                <section className="pageWrapper">
                    <HeadlineTextEmphesized
                    headline={"Unsere Gin Empfehlungen"}
                    text={""}
                    ></HeadlineTextEmphesized>
                    <NoMasonryLayout gins={gins}></NoMasonryLayout>
                </section>
            </MotionWrapper>
        );
    }
}

export default Listing;