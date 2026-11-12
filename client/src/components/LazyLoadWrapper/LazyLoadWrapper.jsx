import React, { useState, useEffect, useRef } from 'react';
import './LazyLoadWrapper.scss';

function LazyLoadWrapper (props) {
    const [ isVisible, setIsVisible] = useState(!props.lazy);
    const containerRef = useRef(null)
    const propClass = props.class ? `${props.class} ` : ""
  
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
        <div className={`${propClass}lazy-container`} ref={containerRef}>
            {!props.lazy ? props.children : ""}
            {props.lazy && isVisible ? props.children : ""}
        </div>
    )
}
export default LazyLoadWrapper;