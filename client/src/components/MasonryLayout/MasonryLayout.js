import React from 'react';
import './MasonryLayout.scss';
import Masonry from 'masonry-layout';
import GinOverviewTile from '../GinOverviewTile/GinOverviewTile.js'

class MasonryLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeFilters: [],
    };
  }

  initMasonry() {
    var grid = document.querySelector('.grid');
    new Masonry( grid, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      percentPosition: true
    });
  }

  updateFilterItems() {
    var allFilterItems = document.getElementsByClassName("filterItem");
    for (let filterItem of allFilterItems) {
      if(this.state.activeFilters.includes(filterItem.getAttribute("id"))){
        if(!filterItem.classList.contains("active")) {
          filterItem.classList.add("active");
        }
      } else {
        filterItem.classList.remove("active");
      }
    }

    const gridItems = document.querySelectorAll('.grid-item');
    for (const item of gridItems) {
      if(this.state.activeFilters.length > 0) {
        var showElement = false;
        var itemTags = item.getAttribute("tags").split(",");
        for(let tag of itemTags) {
          if(this.state.activeFilters.includes(tag))
          {
            showElement = true;
          }
        }
        if(showElement) {
          item.style.display = "block";
        } else
        {
          item.style.display = "none";
        }
      } 
      else {
        item.style.display = "block";
      }
    }
  }

  updateActiveFilters(value) {
    this.setState((state) => ({
      activeFilters: state.activeFilters.includes(value)
        ? state.activeFilters.filter((fc) => fc !== value)
        : [...state.activeFilters, value],
    }))
  }

  componentDidMount() {
    this.updateFilterItems();
    this.initMasonry();
  }

  getCountryFilterOptions() {
    let countryTags = [];
    this.props.gins.map(gin => {
      // add the country to the country filter list
      countryTags.push(gin.originCountry);
    });
    return [...new Set(countryTags)];
  }

  getGinTypeFilterOptions() {
    let ginTypeTags = [];
    this.props.gins.map(gin => {
      // add the country to the country filter list
      ginTypeTags.push(gin.type);
    });
    return [...new Set(ginTypeTags)];
  }

  getTasteFilterOptions() {
    let tasteTags = [];
    this.props.gins.map(gin => {
      // add the country to the country filter list
      tasteTags = tasteTags.concat(gin.mainNote);
    });
    return [...new Set(tasteTags)];  
  }

  componentDidUpdate(_, prevState) {
    if (prevState.activeFilters !== this.state.activeFilters) {
      this.updateFilterItems();
    }
    this.initMasonry();
  }

  render() {
    const countryTags = this.getCountryFilterOptions();
    const ginTypeTags = this.getGinTypeFilterOptions();
    const tasteTags = this.getTasteFilterOptions();

    return (
      <section className="fixed_width">
        <div className="filters">
          <ul className='filter'>
            {countryTags.map(country => (
              <li id={country} className="filterItem" onClick={this.updateActiveFilters.bind(this, country)}>{country}</li>
            ))}
          </ul>
          <ul className='filter'>
            {ginTypeTags.map(ginType => (
              <li id={ginType} className="filterItem" onClick={this.updateActiveFilters.bind(this, ginType)}>{ginType}</li>
            ))}
          </ul>
          <ul className='filter'>
            {tasteTags.map(taste => (
              <li id={taste} className="filterItem" onClick={this.updateActiveFilters.bind(this, taste)}>{taste}</li>
            ))}
          </ul>
        </div>
        <div className="grid">
          <div className="grid-sizer"></div>
          <div className="gutter-sizer"></div>
          {this.props.gins.map(gin => {
                let tagsList = [gin.originCountry, gin.type];
                tagsList = [...tagsList, ...gin.mainNote];
                return (
                  <div className='grid-item' tags={tagsList}>
                    <GinOverviewTile
                    key={gin.id}
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
    );
  }
};

export default MasonryLayout;
