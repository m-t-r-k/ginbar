import React, { useState, useEffect } from 'react';
import './ProgressiveImage.scss';

function ProgessiveImage (props) {
    const [ isLoaded, setIsLoaded] = useState(false);
    const baseClass = "progressiveImage";
    let classes = `${baseClass} ${props.class}`;
    classes = props.isBG ? classes : classes + " not-bg-image";

    useEffect(() =>{
        const url = `../images/blurry/thumb_${props.source}`;
        const image = new Image();
        image.src = url;  
    },[props.source]);

    async function loadFinal() {
        if (props.source) {
            const baseElement = document.getElementById(props.source);
            const url = `../images/${props.source}`;
            const handleLoad = () => {
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
        return true;
    }


    return (
        <div id={props.source} className={isLoaded ? `${classes} loaded` : classes} style={{height: `${props.height}`}}>
            <img className="blurryImage" src={`../images/blurry/thumb_${props.source}`} alt={props.alt} height="100%" onLoad={async() => await loadFinal()}></img>
        </div>
    )
}
export default ProgessiveImage;