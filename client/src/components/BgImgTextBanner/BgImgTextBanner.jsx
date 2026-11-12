import React from 'react';
import './BgImgTextBanner.scss';
import parse from 'html-react-parser';

class BgImgTextBanner extends React.Component {
  render() {
    
    return (
      <section className="full_width">
        <div className="banner_section">
          <div className="bg-img" style={{backgroundImage: `url(../images/${this.props.imageMoodPic})`}}></div>
          <div className="banner-text-wrapper">
              <p className="banner-text">{parse(this.props.description)}</p>
          </div>
        </div>
      </section>
    )
  };
}

export default BgImgTextBanner;