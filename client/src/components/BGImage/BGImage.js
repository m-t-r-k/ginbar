import React, { useEffect, useState } from 'react';
import './BGImage.scss';

function BGImage (props) {
    const [ loading, setLoading] = useState("");

    useEffect(() => {
        const url = `../images/${props.imageMoodPicSmall}`;
        const handleLoad = () => {
            setLoading(" loaded");
        };
        const image = new Image();
        image.addEventListener('load', handleLoad);
        image.src = url;
        return () => {
            image.removeEventListener('load', handleLoad);
        };
    }, [props.imageMoodPicSmall])

    return (
        <div className={`moodPicBg${loading}`} style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div>
    )
}
export default BGImage;