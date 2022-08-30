import React from 'react';
import './MasonryLayout.scss';
import Masonry from 'masonry-layout';
import GinOverviewTile from '../GinOverviewTile/GinOverviewTile.js'

class MasonryLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countryTags: [],
      typeTags: [],
      tasteTags: [],
      activeItems: 0,
      activeFiler: false
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

  toggleFilter() {
    const currentState = this.state.activeFiler;
    this.setState({activeFiler: !currentState})
  }

  updateFilterItems() {
    var allFilterItems = document.querySelectorAll(".filterItem");
    for (let filterItem of allFilterItems) { 
      let filterId = filterItem.getAttribute("id");
      if(this.state.countryTags.includes(filterId) ||
         this.state.typeTags.includes(filterId) ||
         this.state.tasteTags.includes(filterId))
      {         
        if(!filterItem.classList.contains("active"))
        {
          filterItem.classList.add("active");
        }
      } else {
        filterItem.classList.remove("active");
      }
    }
  }

  updateGinItems() {
    const gridItems = document.querySelectorAll('.grid-item');
    let activeItems = 0;
    for (const item of gridItems) {
      var showElement = false;
      var itemTags = item.getAttribute("tags").split(",");
      
      if(!this.state.countryTags.length > 0) {
        showElement = true;
      } else {
        for(let tag of this.state.countryTags) {
          if(itemTags.includes(tag))
          {
            showElement = true;
            break;
          }
          showElement = false;
        }
      }
      
      if(showElement) {
        if(!this.state.typeTags.length > 0) {
          showElement = true;
        } else {
          for(let tag of this.state.typeTags) {
            if(itemTags.includes(tag))
            {
              showElement = true;
              break;
            }
            showElement = false;
          }
        }
      }
    
      if(showElement) {
        if(!this.state.tasteTags.length > 0) {
          showElement = true;
        } else {
          for(let tag of this.state.tasteTags) {
            if(itemTags.includes(tag))
            {
              showElement = true;
              break;
            }
            showElement = false;
          }
        }
      }
      
      if(showElement) {
        item.style.display = "block";
        activeItems += 1;
      } else {
        item.style.display = "none";
      }
    }
    this.setState({activeItems: activeItems});
  }

  updateActiveFilters(value, tagsList) {
    switch (tagsList) {
      case "country":
        this.setState((state) => ({
          countryTags: state.countryTags.includes(value)
            ? state.countryTags.filter((fc) => fc !== value)
            : [...state.countryTags, value],
        }));
        break;
      case "ginType":
        this.setState((state) => ({
          typeTags: state.typeTags.includes(value)
            ? state.typeTags.filter((fc) => fc !== value)
            : [...state.typeTags, value],
        }))
        break;
      case "taste":
        this.setState((state) => ({
          tasteTags: state.tasteTags.includes(value)
            ? state.tasteTags.filter((fc) => fc !== value)
            : [...state.tasteTags, value],
        }))
        break;
    }
  }

  componentDidMount() {
    this.updateFilterItems();
    this.updateGinItems();
    this.initMasonry();
  }

  getCountryFilterOptions() {
    let countryTags = [];
    this.props.gins.map(gin => {
      countryTags.push(gin.originCountry);
    });
    return [...new Set(countryTags)];
  }

  getGinTypeFilterOptions() {
    let ginTypeTags = [];
    this.props.gins.map(gin => {
      ginTypeTags.push(gin.type);
    });
    return [...new Set(ginTypeTags)];
  }

  getTasteFilterOptions() {
    let tasteTags = [];
    this.props.gins.map(gin => {
      tasteTags = tasteTags.concat(gin.mainNote);
    });
    return [...new Set(tasteTags)];  
  }

  componentDidUpdate(_, prevState) {
    if (prevState.countryTags !== this.state.countryTags ||
        prevState.typeTags !== this.state.typeTags ||
        prevState.tasteTags !== this.state.tasteTags) {
      this.updateFilterItems();
      this.updateGinItems();
    }
    this.initMasonry();
  }
  
  render() {
    const countryTags = this.getCountryFilterOptions();
    const ginTypeTags = this.getGinTypeFilterOptions();
    const tasteTags = this.getTasteFilterOptions();
    
    setTimeout(() => {
      this.updateFilterItems();
      this.updateGinItems();
      this.initMasonry();
    }, 250);

    return (
      <section className="fixed_width">
        <div className={this.state.activeFiler ? "filter_wrapper active" : "filter_wrapper"}>
          <div className='filterButton clearfix' onClick={this.toggleFilter.bind(this)}>
            <span>Filtern:<span>{this.state.activeItems} Gins ausgewählt</span></span>
            <div className='filterIcon'>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="filters">
            <div>
              <span>Herkunftsland:</span>
              <ul className='filter'>
                {countryTags.map(country => (
                  <li id={country} className="filterItem" onClick={this.updateActiveFilters.bind(this, country, "country")}>{country}</li>
                ))}
              </ul>
            </div>
            <div>
              <span>Gin Sorte:</span>
              <ul className='filter'>
                {ginTypeTags.map(ginType => (
                  <li id={ginType} className="filterItem" onClick={this.updateActiveFilters.bind(this, ginType, "ginType")}>{ginType}</li>
                ))}
              </ul>
            </div>
            <div>
              <span>Hauptnote:</span>
              <ul className='filter'>
                {tasteTags.map(taste => (
                  <li id={taste} className="filterItem" onClick={this.updateActiveFilters.bind(this, taste, "taste")}>{taste}</li>
                ))}
              </ul>
            </div>
          </div>
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
                    imageMoodPicSmall={gin.imageMoodPicSmall}
                    tags={tagsList}
                    recommendation={gin.recommendation}></GinOverviewTile>
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
