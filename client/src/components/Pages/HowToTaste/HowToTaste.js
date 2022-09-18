import React from "react";
import MotionWrapper from "../../MotionWrapper";
import BgImgTextBannerAltStyle from "../../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle";
import HeadlineTextGradientBg from "../../HeadlineTextGradientBg/HeadlineTextGradientBg";
import './HowToTaste.scss'  
import WebsiteDate from '../../../data/website-data.json';
import SwiperSlider from "../../SwiperSlider/SwiperSlider";

class HowToTaste extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const intro = WebsiteDate.howToTaste.intro;
        const pageContent = WebsiteDate.howToTaste.pageContent;
        return (
            <MotionWrapper>
                <section className='howtotaste pageWrapper'>
                    <HeadlineTextGradientBg image={intro.bgImage}>
                        <h1>{intro.headline}</h1>
                        <p>{intro.text}</p>
                    </HeadlineTextGradientBg>
                    <SwiperSlider
                        data={pageContent}
                        alternateLayout={true} 
                        alternateStyle={false} 
                        imgOverlay={true}
                        styleDark={false}>
                    </SwiperSlider>
                </section>
            </MotionWrapper>
        );
    }
}

export default HowToTaste;