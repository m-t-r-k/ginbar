import React from 'react';
import './GinOverviewTile.scss';
import { Link } from "react-router-dom";
import TagsList from "../TagsList/TagsList";
import BGImage from '../BGImage/BGImage';
import ProgessiveImage from '../ProgressiveImage/ProgressiveImage';
import LazyLoadWrapper from '../LazyLoadWrapper/LazyLoadWrapper';

function GinOverviewTile (props) {

  return (
    <div key={props.id} className="ginOverviewTile" >
        <Link to={`/gins/${props.id}`}>
          <div className='tileContent'>
            <div id='recommendation' className={props.recommendation ? "show" : ""}>
              <span>Tipp</span>
            </div>
            <LazyLoadWrapper lazy={props.lazy}><ProgessiveImage source={props.imageBottle} alt={props.name} height="150px"></ProgessiveImage></LazyLoadWrapper>
            <h2>{props.name}</h2>
            <div className='tagsViewMoreWrapper'>
              <hr></hr>
              <span className='viewMore'>zum Gin</span>
              <div className='tagsList'>
                <TagsList tags={props.tags} inverted={true}></TagsList>
              </div>
            </div>
          </div>
          <LazyLoadWrapper lazy={props.lazy}><BGImage source={props.imageMoodPicSmall}></BGImage></LazyLoadWrapper>
        </Link>
    </div>
  )
}
export default GinOverviewTile;