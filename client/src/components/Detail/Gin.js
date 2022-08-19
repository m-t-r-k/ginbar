import './Gin.css';
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const Gin = () => {

    const [ gin, setData ] = useState({
        id:'',
        name:'',
        type:'',
        originCountry:'',
        originCity:'',
        alcohol:'',
        botanicals:'',
        mainNote:'',
        nosing:'',
        taste:'',
        description:'',
        perfectServe:'',
        imageBottle: '',
        imageMoodPic: ''
    }) 
    
    const { ginId } = useParams();

    useEffect(() => {
        fetch(`http://localhost:3000/gins/${ginId}`)
            .then(res => res.json())
            .then(data => setData({
                id:data.id,
                name:data.name,
                type:data.type,
                originCountry:data.originCountry,
                originCity:data.originCity,
                alcohol:data.alcohol,
                botanicals:data.botanicals,
                mainNote:data.mainNote,
                nosing:data.nosing,
                taste:data.taste,
                description:data.description,
                perfectServe:data.perfectServe,
                imageBottle:data.imageBottle,
                imageMoodPic:data.imageMoodPic
            }))
            .catch(err=>{ console.log(err) })
    }, [ginId]);

    return(
        <>
            <h1>{gin.name}</h1>
            
            <img src={`../images/${gin.imageBottle}`}></img>
            <br></br>Sorte: {gin.type}, {gin.alcohol}
            <br></br>Herkunft: {gin.originCountry}, {gin.originCity}
            <br></br>
            <br></br>Botanicals: {gin.botanicals}
            <br></br>Hauptnote: {gin.mainNote}
            <br></br>
            <br></br>Nosing: {gin.nosing}
            <br></br>Geschmack: {gin.taste}
            <br></br>
                <section className="full-width banner-section">
                    <div className="bg-img" style={{backgroundImage: `url(../images/${gin.imageMoodPic})`}}></div>
                    <div className="banner-text-wrapper">
                        <p className="banner-text">Hieß früher Mosaik Gin, da die Hersteller befreundete Kosmaten („Mosaikleger“) sind. Zudem steht der Name sinnbildlich für das „stimmige“ Geschmacksbild.</p>
                    </div>
                </section>
            <br></br>
            <br></br>Perfect Serve: {gin.perfectServe}
            
            <br></br>
            <Link to={`/gins`}>mehr Gins entdecken...</Link>
        </>
    )
}

export default Gin;