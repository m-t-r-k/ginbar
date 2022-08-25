import React from 'react';
import './FlexBoxSection.scss';
import GinOverviewTile from "../GinOverviewTile/GinOverviewTile";

class FlexBoxSection extends React.Component {
  render() {
    return (
      <section className="fixed_width">
        <div className="FlexBoxSection">
          {this.props.gins.map(gin => {
              let tagsList = [gin.originCountry, gin.type];
              tagsList = [...tagsList, ...gin.mainNote];
              return (
                  <GinOverviewTile
                  id={gin.id}
                  name={gin.name}
                  imageBottle={gin.imageBottle}
                  imageMoodPic={gin.imageMoodPic}
                  tags={tagsList}></GinOverviewTile>
              );
            })
          }
        </div>
      </section>
    )
  }
};

export default FlexBoxSection;
