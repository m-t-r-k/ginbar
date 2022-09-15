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

        const htmlDataArray = pageContent.map((item,index) => {
            let evenIndex = (index + 1) % 2 === 0;
            return (
            <BgImgTextBannerAltStyle key={item.id} 
            dark={evenIndex ? true : false} 
            right={evenIndex ? true : false} 
            bgImage={item.bgImage}>
                <h2>{index + 1}. {item.headline}</h2>
                <p>{item.text}</p>
            </BgImgTextBannerAltStyle>
            );
        })

        return (
            <MotionWrapper>
                <section className='howtotaste pageWrapper'>
                    <HeadlineTextGradientBg image={intro.bgImage}>
                        <h1>{intro.headline}</h1>
                        <p>{intro.text}</p>
                    </HeadlineTextGradientBg>
                    <SwiperSlider data={pageContent}></SwiperSlider>
                </section>
            </MotionWrapper>
        );
    }
}

export default HowToTaste;