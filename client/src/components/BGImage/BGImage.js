import React from 'react';

function BGImage (props) {
    return (
        <div className='moodPicBg' style={{backgroundImage: `url(../images/${props.imageMoodPicSmall})`}}></div>
    )
}
export default BGImage;