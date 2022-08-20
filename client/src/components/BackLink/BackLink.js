import React from "react";
import './BackLink.scss';
import { Link } from "react-router-dom";
  
class BackLink extends React.Component {
    render() {
        return (
            <section className="full_with">
                <div className="back_link">
                    <Link to={`/gins`}>zurück zur Gin Auswahl</Link>
                </div>
            </section>
        );
    }
}

export default BackLink;