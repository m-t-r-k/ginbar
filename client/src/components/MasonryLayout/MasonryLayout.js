import React from 'react';
import './MasonryLayout.scss';
import Masonry from 'masonry-layout';
import GinOverviewTile from '../GinOverviewTile/GinOverviewTile.js'

class MasonryLayout extends React.Component {
  render() {

    var elem = document.querySelector('.grid');
    var msnry = new Masonry( elem, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      percentPosition: true
    });

    return (
      <section className="fixed_with">
        <div class="grid">
          <div class="grid-sizer"></div>
          <div class="gutter-sizer"></div>
          {this.props.gins.map(gin => {
                let tagsList = [gin.originCountry, gin.type];
                tagsList = [...tagsList, ...gin.mainNote];
                return (
                  <div className='grid-item'>
                    <GinOverviewTile
                    id={gin.id}
                    name={gin.name}
                    imageBottle={gin.imageBottle}
                    imageMoodPic={gin.imageMoodPic}
                    tags={tagsList}></GinOverviewTile>
                  </div>
                );
              })
            }
        </div>
      </section>
    )
  }
};

export default MasonryLayout;
