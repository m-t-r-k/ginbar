import React from 'react';
import './HeadlineTextEmphesized.scss';

class HeadlineTextEmphesized extends React.Component {
  render() {
    return (
      <section className="fixed_width no_margin_top">
        <div className="headline_text_emphesized">
          <div className="headline">
            <span></span>
            <h2>Perfect Serve</h2>
            <span></span>
          </div>
          <p>{this.props.perfectServe}</p>
        </div>
      </section>
    )
  }
};

export default HeadlineTextEmphesized;
