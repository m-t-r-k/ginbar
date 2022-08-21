import React from 'react';
import './GinOverviewTile.scss';
import { Link } from "react-router-dom";
import TagsList from "../TagsList/TagsList";

class GinOverviewTile extends React.Component {
  render() {
    return (
      <div key={this.props.id} className="ginOverviewTile">
          <Link to={`/gins/${this.props.id}`}>
            <div className='tileContent'>
              <img src={`../images/${this.props.imageBottle}`}></img>
              <div className='headlineWrapper'>
                <span><h2>{this.props.name}</h2></span>
                <TagsList tags={this.props.tags}></TagsList>
              </div>
            </div>
            <div className='moodPicBg' style={{backgroundImage: `url(../images/${this.props.imageMoodPic})`}}></div>
          </Link>
      </div>
    )
  }
}
export default GinOverviewTile;
