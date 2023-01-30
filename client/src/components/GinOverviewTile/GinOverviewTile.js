import React, { useState, useEffect, useRef } from 'react';
import './GinOverviewTile.scss';
import { Link } from "react-router-dom";
import TagsList from "../TagsList/TagsList";
import BGImage from '../BGImage/BGImage';
import ProgessiveImage from '../ProgressiveImage/ProgressiveImage';

function GinOverviewTile (props) {
  const [ isVisible, setIsVisible] = useState(!props.lazy);
  const containerRef = useRef(null)

  useEffect(() => {
    const callbackFunction = (entries) => {
      const [ entry ] = entries
      if ( entry.isIntersecting ) {
        setIsVisible(true);
      }
    }
  
    if(!isVisible) {
      const options = {
        root: null,
        rootMargin: "0px 0px 300px 0px",
        threshold: 0
      }
      const refCurrent = containerRef.current
      const observer = new IntersectionObserver(callbackFunction, options)
      if (refCurrent) observer.observe(refCurrent)

      return () => {
        if(refCurrent) observer.unobserve(refCurrent)
      }
    }
  }, [containerRef, isVisible])

  return (
    <div key={props.id} className="ginOverviewTile" ref={containerRef}>
        <Link to={`/gins/${props.id}`}>
          <div className='tileContent'>
            <div id='recommendation' className={props.recommendation ? "show" : ""}>
              <span>Tipp</span>
            </div>
            <span className="imageWrapper">
              {!props.lazy ? <ProgessiveImage source={props.imageBottle} alt={props.name} height="150px"></ProgessiveImage> : ""}
              {props.lazy && isVisible ? <ProgessiveImage source={props.imageBottle} alt={props.name} height="150px"></ProgessiveImage> : ""}
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
          {!props.lazy ? <BGImage source={props.imageMoodPicSmall}></BGImage> : ""}
          {props.lazy && isVisible ? <BGImage source={props.imageMoodPicSmall}></BGImage> : ""}
        </Link>
    </div>
  )
}
export default GinOverviewTile;