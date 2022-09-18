import React from 'react';
import './HeadlineTextListImage.scss';

class HeadlineTextListImage extends React.Component {
  render() {
    return (
      <section className="full_width headlineTextListImage">
        <div className='contentWrap fixed_width'>
          <div className='imgWrap'>
            <img src={`../images/${this.props.image}`}></img>  
          </div>
          <div className='textContent'>
            <h2>{this.props.headline}</h2>
            <p>{this.props.text}</p>
            <ul>
              {this.props.factsList.map((fact) => {
                return(
                <li>{fact}</li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    )
  }
}

export default HeadlineTextListImage;
