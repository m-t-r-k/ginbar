import React from "react";
import Button from "../Button/Button";
import HeadlineTextGradientBg from "../HeadlineTextGradientBg/HeadlineTextGradientBg";
import TagsList from "../TagsList/TagsList";
import './GinDetailOverview.scss';
  
class GinDetailOverview extends React.Component {
    render() {

        let botanicalsList = Object.values(this.props.botanicals).join(', ');
        
        let affiliateLink
        if(this.props.affiliateLink !== undefined && this.props.affiliateLink !== null && this.props.affiliateLink.trim().length > 0) {
            affiliateLink = <Button
                    link={this.props.affiliateLink}
                    targetBlank={true}
                    affiliateLink={true}
                    text="Hier bestellen"></Button>
        }

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
                {/* affiliateLink */}
            </HeadlineTextGradientBg>
        );
    }
}

export default GinDetailOverview;