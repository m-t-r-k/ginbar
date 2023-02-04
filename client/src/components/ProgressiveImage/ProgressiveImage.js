import React, { useEffect, useState } from 'react';
import './ProgressiveImage.scss';

function ProgressiveImage (props) {
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
        <img className={`progressive-image${loading}`} src={`../images/${props.source}`} alt={props.alt}></img>
    )
}
export default ProgressiveImage;