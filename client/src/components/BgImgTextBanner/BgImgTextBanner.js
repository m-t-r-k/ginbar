import React from 'react';
import './BgImgTextBanner.scss';

class BgImgTextBanner extends React.Component {
  render() {
    
    return (
      <section className="full_width">
          <div className="banner_section">
            <div className="bg-img" style={{backgroundImage: `url(../images/${this.props.imageMoodPic})`}}></div>
            <div className="banner-text-wrapper">
                <p className="banner-text">{this.props.description}</p>
            </div>
          </div>
        </section>
    )
  };
}

export default BgImgTextBanner;