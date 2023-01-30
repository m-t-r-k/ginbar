import React, { useEffect, useState } from 'react';
import './BGImage.scss';

function BGImage (props) {
    const [ loading, setLoading] = useState("");

    useEffect(() => {
        console.log(loading)
        const timeout = setTimeout(() => {
            setLoading(" loaded");
        }, 10)
      
        return () => clearTimeout(timeout)
        
    }, [])

    return (
        <div className={`moodPicBg${loading}`} style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div>
    )
}
export default BGImage;