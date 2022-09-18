import React, { useEffect } from "react";
import './GinTypes.scss';
import MotionWrapper from "../../MotionWrapper";
import BgImgTextBannerAltStyle from "../../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle";
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import SwiperSlider from "../../SwiperSlider/SwiperSlider";
import WebsiteDate from '../../../data/website-data.json';
import HeadlineTextListImage from "../../HeadlineTextListImage/HeadlineTextListImage";

const GinTypes = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  });

  const intro = WebsiteDate.ginTypes.intro;
  const officialTypes = WebsiteDate.ginTypes.officialTypes;
  const otherTypes = WebsiteDate.ginTypes.otherTypes;

  return(
    <MotionWrapper>
      <section className="pageWrapper">
        <BgImgTextBannerAltStyle
          dark={true} 
          right={false}
          imgOverlay={true}
          bgImage={intro.bgImage}>
              <h1>{intro.headline}</h1>
              <p>{intro.text}</p>
        </BgImgTextBannerAltStyle>

        <HeadlineTextEmphesized
                headline={officialTypes.intro.headline}
                text={officialTypes.intro.text}>
        </HeadlineTextEmphesized>
        {officialTypes.data.map((officialType) => {
          return(<HeadlineTextListImage
            key={officialType.id}
            image={officialType.image}
            headline={officialType.headline}
            text={officialType.text}
            factsList={officialType.facts}
          ></HeadlineTextListImage>)
        })}

        <HeadlineTextEmphesized
                headline={otherTypes.intro.headline}
                text={otherTypes.intro.text}>
        </HeadlineTextEmphesized>
        <SwiperSlider 
                data={otherTypes.data} 
                alternateLayout={false} 
                alternateStyle={false} 
                imgOverlay={true}
                styleDark={true}>
        </SwiperSlider>
      </section>
    </MotionWrapper>
    )
}
export default GinTypes;