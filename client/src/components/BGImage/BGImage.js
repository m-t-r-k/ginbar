import React, { useEffect, useState } from 'react';
import './BGImage.scss';

function BGImage (props) {
    const [ loading, setLoading] = useState("");

    useEffect(() => {
        const url = `../images/${props.source}`;
        const handleLoad = () => {
            setLoading(" loaded");
        };
        const image = new Image();
        image.addEventListener('load', handleLoad);
        image.src = url;
        return () => {
            image.removeEventListener('load', handleLoad);
        };
    }, [props.source])

    return (
        <div className={`moodPicBg${loading}`} style={{backgroundImage: `url(../images/${props.source})`}}></div>
    )
}
export default BGImage;