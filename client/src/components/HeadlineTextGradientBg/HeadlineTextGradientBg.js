import React from 'react';
import './HeadlineTextGradientBg.scss';

class HeadlineTextGradientBg extends React.Component {
  render() {
      return (
      <section className="fixed_width">
        <div className="HeadlineTextGradientBg">
          <div className="image">
            <img src={`../images/${this.props.image}`} alt=""></img>  
          </div>
          <div className="description">
            {this.props.children}
          </div>
        </div>
      </section>
    )
  }
};

export default HeadlineTextGradientBg;
