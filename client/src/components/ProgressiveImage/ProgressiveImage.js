import React from 'react';
import './ProgressiveImage.scss';

function ProgessiveImage (props) {
    const baseClass = "progressiveImage";
    let classes = `${baseClass} ${props.class}`;
    classes = props.isBG ? classes : classes + " not-bg-image";

    return (
        <div id={props.source} className={classes} style={{backgroundImage: `url(../images/${props.source})`, height: `${props.height}`}}>
        </div>
    )
}
export default ProgessiveImage;