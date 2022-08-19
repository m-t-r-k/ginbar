import React from "react";
import { Link } from "react-router-dom";
  
class Listing extends React.Component {
    state = {
      gins: []
    }

    componentDidMount() {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => this.setState({ gins: data }));
        console.log(this.state.gins);
    }

    render() {
        return (
            <div>
                <h1>Gins</h1>
                {this.state.gins.map(gin => {
                    return (
                        <div key={gin.id}>
                            <h2>{gin.name}</h2>
                            <div>
                                <span>{gin.type}, {gin.alcohol}</span><br></br>
                                <span>{gin.originCountry}</span><br></br>
                                <span>{gin.mainNote}</span>
                            </div>
                            <Link to={`/gins/${gin.id}`}>Details</Link>
                            <hr />
                        </div>
                    );
                    })
                }
            </div>
        );
    }
}

export default Listing;