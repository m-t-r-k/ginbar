import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Gin = () => {

    const [ Data, setData ] = useState({
        name:'',
        type:''
    }) 
    
    const { ginId } = useParams();

    useEffect(() => {
        fetch(`http://localhost:3000/gins/${ginId}`)
            .then(res => res.json())
            .then(data => setData({ name:data.name, type:data.type }))
            .catch(err=>{ console.log(err) })
    }, [ginId]);

    return(
        <>
            <h1>{Data.name}</h1>
            <p>{Data.type}</p>
        </>
    )
}

export default Gin;