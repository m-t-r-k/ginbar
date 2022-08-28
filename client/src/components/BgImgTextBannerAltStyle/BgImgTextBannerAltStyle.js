import React from "react";
import './BgImgTextBannerAltStyle.scss';

class BgImgTextBannerAltStyle extends React.Component {
  render() {

    let dark = this.props.dark ? "light" : "dark";
    let right = this.props.right ? "right" : "left";
    let sectionClasses = `alternating_banner_section ${dark} ${right}`;

    return (
      <section className="full_width">
        <div className={sectionClasses}>
          <div className="bg-img" style={{backgroundImage: `url(../images/${this.props.bgImage})`}}></div>
          <div className="banner-content-wrapper">
            <div className="banner-content">
                {this.props.children}
            </div>
          </div>  
        </div>
      </section>
    )
  }
};

export default BgImgTextBannerAltStyle;
