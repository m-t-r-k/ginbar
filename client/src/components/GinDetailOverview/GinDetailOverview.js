import React from "react";
import HeadlineTextGradientBg from "../HeadlineTextGradientBg/HeadlineTextGradientBg";
import TagsList from "../TagsList/TagsList";
import './GinDetailOverview.scss';
  
class GinDetailOverview extends React.Component {
    render() {

        let botanicalsList = Object.values(this.props.botanicals).join(', ');
        
        return (
            <HeadlineTextGradientBg image={this.props.imageBottle}>
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
            </HeadlineTextGradientBg>
        );
    }
}

export default GinDetailOverview;