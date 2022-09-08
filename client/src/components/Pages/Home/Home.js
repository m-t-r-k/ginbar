import React from "react";
import { Link } from "react-router-dom";
import './Home.scss';
import MotionWrapper from "../../MotionWrapper";
import WebsiteDate from '../../../data/website-data.json';

class Home extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const teasterElements = WebsiteDate.home;
        return (
            <MotionWrapper>
                <section className="home">
                    {teasterElements.map(teasterElement => {
                        return(
                            <Link to={teasterElement.routerToLink}>
                                <div className="homeColumnWrap">
                                    <div className="homeColumnContent">
                                        <h2>{teasterElement.headline}</h2>
                                        <div>
                                            <span className="buttonHome">{teasterElement.buttonText}</span>
                                        </div>
                                    </div>
                                    <span></span>
                                    <video autoPlay muted loop>
                                        <source src={`../images/${teasterElement.videoBg}`} type="video/mp4"></source>
                                    </video> 
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </MotionWrapper>
        )
    }
}

export default Home;