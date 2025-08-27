import React, { useEffect } from "react";
import './BarMenu.scss';
import MotionWrapper from "../../MotionWrapper";
import BgImgTextBannerAltStyle from "../../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle";
import WebsiteData from '../../../data/website-data.json';
import BarMenuList from "../../BarMenuList/BarMenuList";

const BarMenu = () => {
	
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const barMenu = WebsiteData.barMenu;

  return(
    <MotionWrapper>
		<section id="bar_menu" className='pageWrapper'>
			<BgImgTextBannerAltStyle
				dark={true} 
				right={false}
				imgOverlay={true}
				bgImage={barMenu.bgImage}>
				<h1>{barMenu.headline}</h1>
			</BgImgTextBannerAltStyle>

			<BarMenuList />
		</section>
	</MotionWrapper>
  )
}

export default BarMenu;