import React from "react";
import './BgImgTextBannerAltStyle.scss';

class BgImgTextBannerAltStyle extends React.Component {
  render() {

    let dark = this.props.dark ? "light" : "dark";
    let right = this.props.right ? "right" : "left";
    let sectionClasses = `alternating_banner_section fixed_width ${dark} ${right}`;

    return (
      <section className="full_width">
        <div className={sectionClasses}>
          <div className="bg-img" style={{backgroundImage: `url(../images/${this.props.bgImage})`}}></div>
          <div className="banner-text-wrapper">
              {this.props.children}
          </div>
        </div>
      </section>
    )
  }
};

export default BgImgTextBannerAltStyle;
