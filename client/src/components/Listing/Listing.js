import React from "react";
  
class Listing extends React.Component {
    state = {
      gins: []
    }

    componentDidMount() {
        fetch("http://localhost:3000/gins")
          .then(res => res.json())
          .then(data => this.setState({ gins: data.gins }));
        console.log(this.state.gins);
    }

    render() {
        return (
            <div>
                <h1>Gins</h1>
                {this.state.gins.map(gin => {
                    return (
                        <div key={gin.id}>
                            <h2>name: {gin.name}</h2>
                            <h2>country: {gin.type}</h2>

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