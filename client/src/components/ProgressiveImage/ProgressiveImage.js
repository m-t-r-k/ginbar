import React, { useState, useEffect } from 'react';
import './ProgressiveImage.scss';

function ProgessiveImage (props) {
    const [ isLoaded, setIsLoaded] = useState(false);
    const baseClass = "progressiveImage";
    let classes = `${baseClass} ${props.class}`;
    classes = props.isBG ? classes : classes + " not-bg-image";

    useEffect(() => {
        if (props.source) {
            const baseElement = document.getElementById(props.source);
            const url = `../images/${props.source}`
            const handleLoad = () => {
                console.log(baseElement);
                baseElement.style.backgroundImage = `url(${url})`;
                setIsLoaded(true);
            };
            const image = new Image();
            image.addEventListener('load', handleLoad);
            image.src = url;
            return () => {
                image.removeEventListener('load', handleLoad);
            };
        }
    }, [props.source]);


    return (
        <div id={props.source} className={isLoaded ? `${classes} loaded` : classes} style={{height: `${props.height}`}}>
            <img className="blurryImage" src={`../images/blurry/thumb_${props.source}`} alt={props.alt} height="100%"></img>
        </div>
    )
}
export default ProgessiveImage;