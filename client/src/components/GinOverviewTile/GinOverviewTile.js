import React, { useState, useEffect, useRef } from 'react';
import './GinOverviewTile.scss';
import { Link } from "react-router-dom";
import TagsList from "../TagsList/TagsList";

function GinOverviewTile (props) {
  const [ isVisible, setIsVisible] = useState(!props.lazy);
  const containerRef = useRef(null)

  const callbackFunction = (entries) => {
    const [ entry ] = entries
    if ( entry.isIntersecting ) setIsVisible(true)
  }

  useEffect(() => {
    if(!isVisible) {
      const options = {
        root: null,
        rootMargin: "0px",
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
          {!props.lazy ? <div className='moodPicBg' style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div> : ""}
          {props.lazy && isVisible ? <div className='moodPicBg' style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div> : ""}
        </Link>
    </div>
  )
}
export default GinOverviewTile;