import React from "react";
import TagsList from "../TagsList/TagsList";
import './GinDetailOverview.scss';
  
class GinDetailOverview extends React.Component {
    render() {

        let botanicalsList = Object.values(this.props.botanicals).join(', ');
        
        return (
            <section className="fixed_width">
                <div className="gin_detail_overview">
                    <div className="bottle">
                        <img src={`../images/${this.props.imageBottle}`}></img>  
                    </div>
                    <div className="description">
                        <h1>{this.props.name}</h1>
                        <TagsList tags={this.props.tags}></TagsList>
                        <div className="detailed_description clearfix">
                        <dl>
                            <dt>Herkunft</dt>
                            <dd>{this.props.originCountry}, {this.props.originCity}</dd>
                            <dt>Gin Sorte</dt>
                            <dd>{this.props.type}, {this.props.alcohol}</dd>
                            <dt>Botanicals</dt>
                            <dd>{botanicalsList}</dd>
                        </dl>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default GinDetailOverview;