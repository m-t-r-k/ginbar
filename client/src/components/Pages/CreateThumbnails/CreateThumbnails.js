import React from "react";
import GinData from '../../../data/gin-data.json';
  
class CreateThumbnails extends React.Component {

    downloadThumbnail(source) {
        const canvas = document.getElementById(`canvas_${source}`);
        const image = document.getElementById(`img_${source}`);
        const widthI = image.naturalWidth;
        const heightI = image.naturalHeight;
        canvas.width = 5;
        canvas.height = heightI/widthI*5;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 5, heightI/widthI*5);

        // Convert our canvas to a data URL
        let canvasUrl = canvas.toDataURL();
        // Create an anchor, and set the href value to our data URL
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;

        // This is the name of our downloaded file
        createEl.download = `thumb_${source}`;

        // Click the download button, causing a download, and then remove it
        createEl.click();
        createEl.remove();
    }

    render() {
        const gins = GinData;
        let images = gins.map(gin => gin.imageBottle);
        images = images.concat(gins.map(gin => gin.imageMoodPic));
        images = images.concat(gins.map(gin => gin.imageMoodPicSmall));

        return (
            <div>
                {images.map(source => {
                    return (
                        <div>
                            <canvas id={`canvas_${source}`}></canvas>
                            <div>
                                <img id={`img_${source}`} src={`../images/${source}`} alt="make this a Thumbnail"></img>
                            </div>
                            <button onClick={() => this.downloadThumbnail(source)}>Download</button>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default CreateThumbnails;