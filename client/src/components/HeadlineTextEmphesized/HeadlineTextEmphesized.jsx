import React from 'react';
import './HeadlineTextEmphesized.scss';
import parse from 'html-react-parser';

class HeadlineTextEmphesized extends React.Component {
  render() {

    return (
      <section className="fixed_width">
        <div className="headline_text_emphesized">
          <div className="headline">
            <span></span>
            <h2>{this.props.headline}</h2>
            <span></span>
          </div>
          <p>{parse(this.props.text)}</p>
        </div>
      </section>
    )
  }
};

export default HeadlineTextEmphesized;
