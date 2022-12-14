import React from 'react';
import './SwiperSlider.scss';
import BgImgTextBannerAltStyle from '../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import parse from 'html-react-parser';

class SwiperSlider extends React.Component {

  render() {

    const paginationNames = this.props.data.map((item) => { return item.headline})

    const pagination = {
      clickable: true,
      renderBullet: function (index, className) {
        return '<div class="swiper-custom-pagination ' + className + '"><span>' + paginationNames[index] + "</span></div>";
      },
    };

    return(
      <Swiper
        direction={"horizontal"}
        loop={true}
        pagination={pagination}
        navigation={true}
        effect={"fade"}
        modules={[Pagination, Navigation, EffectFade]}
        className="swiper"
      >
        {this.props.data.map((item,index) => {
            let evenIndex = (index + 1) % 2 === 0;
            return (
                <SwiperSlide 
                  key={item.id}>
                    <BgImgTextBannerAltStyle
                        dark={this.props.alternateStyle ? (evenIndex ? true : false) : this.props.styleDark} 
                        right={this.props.alternateLayout ? (evenIndex ? true : false): false} 
                        imgOverlay={this.props.imgOverlay}
                        bgImage={item.bgImage}>
                        <h2>{item.headline}</h2>
                        <p>{parse(item.text)}</p>
                    </BgImgTextBannerAltStyle>
                </SwiperSlide>
            );
        })}
      </Swiper>
    )
  }
};

export default SwiperSlider;
