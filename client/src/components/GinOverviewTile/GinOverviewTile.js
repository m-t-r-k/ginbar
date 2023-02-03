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
              <div id='recommendation' className={this.props.recommendation ? "show" : ""}>
                <span>Tipp</span>
              </div>
              <img src={`../images/${this.props.imageBottle}`} alt={this.props.name}></img>
              <h2>{this.props.name}</h2>
              <div className='tagsViewMoreWrapper'>
                <hr></hr>
                <span className='viewMore'>zum Gin</span>
                <div className='tagsList'>
                  <TagsList tags={this.props.tags} inverted={true}></TagsList>
                </div>
              </div>
            </div>
            <div className='moodPicBg' style={{backgroundImage: `url(../images/${this.props.imageMoodPicSmall})`}}></div>
          </Link>
      </div>
    )
  }
}
export default GinOverviewTile;