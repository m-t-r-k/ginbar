import React from 'react';
import './GinOverviewTile.scss';
import { Link } from "react-router-dom";
import TagsList from "../TagsList/TagsList";

function GinOverviewTile (props) {
  return (
    <div key={props.id} className="ginOverviewTile">
        <Link to={`/gins/${props.id}`}>
          <div className='tileContent'>
            <div id='recommendation' className={props.recommendation ? "show" : ""}>
              <span>Tipp</span>
            </div>
            <span className="imageWrapper">
              <img src={`../images/${props.imageBottle}`} alt={props.name} height="150px" loading={props.lazy ? 'lazy' : 'eager'}></img>
            </span>
            <h2>{props.name}</h2>
            <div className='tagsViewMoreWrapper'>
              <hr></hr>
              <span className='viewMore'>zum Gin</span>
              <div className='tagsList'>
                <TagsList tags={props.tags} inverted={true}></TagsList>
              </div>
            </div>
          </div>
          <div className='moodPicBg' style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div>
        </Link>
    </div>
  )
}
export default GinOverviewTile;