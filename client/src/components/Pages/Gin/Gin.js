import './Gin.scss';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MotionWrapper from "../../MotionWrapper";
import GinDetailOverview from "../../GinDetailOverview/GinDetailOverview";
import BgImgTextBanner from "../../BgImgTextBanner/BgImgTextBanner";
import KeywordDescriptionBox from "../../KeywordDescriptionBox/KeywordDescriptionBox";
import HeadlineTextEmphesized from '../../HeadlineTextEmphesized/HeadlineTextEmphesized';
import BackLink from "../../BackLink/BackLink";
import GinData from '../../../data/gin-data.json';

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
        imageMoodPic: '',
        imageMoodPicSmall: ''
    }) 
    
    const { ginId } = useParams();

    useEffect(() => {

        let data = GinData.find( gin => gin.id === ginId );

        setData({
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
        })

        window.scrollTo(0, 0)
    }, [ginId]);

    let tagsList = [gin.originCountry, gin.type];
    tagsList = [...tagsList, ...gin.mainNote];

    return(
        <MotionWrapper>
            <section className='pageWrapper'>
                <GinDetailOverview 
                name={gin.name} 
                type={gin.type} 
                originCountry={gin.originCountry} 
                originCity={gin.originCity} 
                alcohol={gin.alcohol} 
                botanicals={gin.botanicals} 
                imageBottle={gin.imageBottle} 
                tags={tagsList}></GinDetailOverview>

                <BgImgTextBanner
                imageMoodPic={gin.imageMoodPic}
                description={gin.description}></BgImgTextBanner>

                <KeywordDescriptionBox
                nosing={gin.nosing}
                taste={gin.taste}></KeywordDescriptionBox>

                <HeadlineTextEmphesized
                headline={"Perfect Serve"}
                text={gin.perfectServe}></HeadlineTextEmphesized>

                <BackLink></BackLink>
            </section>
        </MotionWrapper>
    )
}

export default Gin;