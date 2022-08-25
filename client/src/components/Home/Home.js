import React from "react";
import './Home.scss';
import { Link } from "react-router-dom";

  
class Home extends React.Component {
    state = {
      name: ""
    }

    componentDidMount() {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => this.setState({ name: data.name }));
        console.log(this.state.name);
    }

    render() {
        return (
            <section className="home">
                <Link to="/how-to-taste/">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>How To Taste</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/how_to_taste_video.mp4" type="video/mp4"></source>
                        </video> 
                    </div>
                </Link>
                <Link to="/gins/">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>Gin Auswahl</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/gin_auswahl_video.mp4" type="video/mp4"></source>
                        </video>            
                    </div>
                </Link>
                <Link to="/cocktails/">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>Gin Cocktails</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/gin_cocktail_video.mp4" type="video/mp4"></source>
                        </video>            
                    </div>
                </Link>
            </section>
        )
    }
}

export default Home;