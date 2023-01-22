import React, { useState, useEffect } from 'react';
import './ProgressiveImage.scss';

function ProgessiveImage (props) {
    const [ isLoaded, setIsLoaded] = useState(false);
    const baseClass = "progressiveImage";
    let classes = `${baseClass} ${props.class}`;
    classes = props.isBG ? classes : classes + " not-bg-image";

    useEffect(() => {
        if (props.source && props.showImage) {
            const baseElement = document.getElementById(props.source);
            const url = `../images/${props.source}`;
            const handleLoad = () => {
                setIsLoaded(true);
                baseElement.style.backgroundImage = `url(${url})`;
            };
            const image = new Image();
            image.addEventListener('load', handleLoad);
            image.src = url;
            return () => {
                image.removeEventListener('load', handleLoad);
            };
        }
    }, [props.source, props.showImage]);


    return (
        <div id={props.source} className={isLoaded ? `${classes} loaded` : classes} style={{height: `${props.height}`}}>
            <img className="blurryImage" src={`../images/blurry/thumb_${props.source}`} alt={props.alt} height="100%" loading='lazy'></img>
        </div>
    )
}
export default ProgessiveImage;