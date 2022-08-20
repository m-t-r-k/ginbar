import React from 'react';
import './KeywordDescriptionBox.scss';

class KeywordDescriptionBox extends React.Component {
  render() {
      
    return (
      <section className="fixed_with">
          <div className="keyword_description_list">
            <div>
              <span>Nosing</span>
              <div></div>
              <p>{this.props.nosing}</p>
            </div>
            <div>
              <span>Tasting</span>
              <div></div>
              <p>{this.props.taste}</p>
            </div>
          </div>
        </section>
    );
  }
}

export default KeywordDescriptionBox;
