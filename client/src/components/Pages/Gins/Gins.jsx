import React from "react";
import MotionWrapper from "../../MotionWrapper";
import './Gins.scss';
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import GinList from "../../GinList/GinList";
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
                    <GinList gins={gins} />
                </section>
            </MotionWrapper>
        );
    }
}

export default Listing;