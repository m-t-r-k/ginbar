import React from "react";
import './Home.scss';

  
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
                <a href="">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>How To<br></br>Taset</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/how_to_taste_video.mp4" type="video/mp4"></source>
                        </video> 
                    </div>
                </a>
                <a href="">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>Gin<br></br>Auswahl</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/gin_auswahl_video.mp4" type="video/mp4"></source>
                        </video>            
                    </div>
                </a>
                <a href="">
                    <div className="homeColumnWrap">
                        <div className="homeColumnContent">
                            <h2>Gin<br></br>Cocktails</h2>
                            <div>
                                <span className="buttonHome">mehr erfahren</span>
                            </div>
                        </div>
                        <span></span>
                        <video autoPlay muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                            <source src="../images/gin_cocktail_video.mp4" type="video/mp4"></source>
                        </video>            
                    </div>
                </a>
            </section>
        )
    }
}

export default Home;