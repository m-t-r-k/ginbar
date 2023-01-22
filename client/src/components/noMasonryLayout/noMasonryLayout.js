import React from 'react';
import GinOverviewTile from '../GinOverviewTile/GinOverviewTile.js';
import './noMasonryLayout.scss';
import Switch from "react-switch";

class NoMasonryLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countryTags: [],
      typeTags: [],
      tasteTags: [],
      activeItems: 0,
      largeFilter: false,
      activeFilter: false,
      showTips: false
    };
  }

  updateShowTips() {
    const currentState = this.state.showTips;
    this.setState({ showTips: !currentState });
  }

  toggleFilter() {
    const currentState = this.state.activeFilter;
    this.setState({ activeFilter: !currentState });
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
      var itemTags = item.getAttribute("tags").toLowerCase().split(",");
      
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

      // Show tips
      if(showElement) {
        if(this.state.showTips) {
          if(item.getAttribute("data-tipp") !== 'true') {
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
    const val = value.toLowerCase();
    switch (tagsList) {
      case "country":
        this.setState((state) => ({
          countryTags: state.countryTags.includes(val)
            ? state.countryTags.filter((fc) => fc !== val)
            : [...state.countryTags, val],
        }));
        break;
      case "ginType":
        this.setState((state) => ({
          typeTags: state.typeTags.includes(val)
            ? state.typeTags.filter((fc) => fc !== val)
            : [...state.typeTags, val],
        }))
        break;
      case "taste":
        this.setState((state) => ({
          tasteTags: state.tasteTags.includes(val)
            ? state.tasteTags.filter((fc) => fc !== val)
            : [...state.tasteTags, val],
        }))
        break;
      default:
        break;
    }
  }

  getCountryFilterOptions() {
    let countryTags = [];
    this.props.gins.map(gin => {
      countryTags.push(gin.originCountry.toLowerCase());
      return true;
    });
    return [...new Set(countryTags)];
  }

  getGinTypeFilterOptions() {
    let ginTypeTags = [];
    this.props.gins.map(gin => {
      ginTypeTags.push(gin.type.toLowerCase());
      return true;
    });
    return [...new Set(ginTypeTags)];
  }

  getTasteFilterOptions() {
    let tasteTags = [];
    this.props.gins.map(gin => {
      tasteTags = tasteTags.concat(gin.mainNote.map(value => value.toLowerCase()));
      return true;
    });
    return [...new Set(tasteTags)];  
  }

  updateFilterVisibility = () => {

    if(window.innerWidth > 1260) {
      this.setState({largeFilter: true});

      if(this.state.activeFilter || !this.state.activeFilter) {
        this.setState({activeFilter: true});
      }
    } else {
      this.setState({largeFilter: false});

      if(this.state.activeFilter) {
        this.setState({activeFilter: true});
      }
      if(!this.state.activeFilter) {
        this.setState({activeFilter: false});
      }
    }
  }

  componentDidMount() {
    const imagesPreload = [this.props.gins[0].imageBottle, 
                            this.props.gins[0].imageMoodPicSmall,
                            this.props.gins[1].imageBottle, 
                            this.props.gins[1].imageMoodPicSmall,
                            this.props.gins[2].imageBottle, 
                            this.props.gins[2].imageMoodPicSmall,                            
                            this.props.gins[3].imageBottle, 
                            this.props.gins[3].imageMoodPicSmall ];
    imagesPreload.forEach((image) => {
        const newImage = new Image();
        newImage.src = image;
        window[image] = newImage;
    });
    this.updateFilterItems();
    this.updateGinItems();
    window.addEventListener('resize', this.updateFilterVisibility);
    this.updateFilterVisibility();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.countryTags !== this.state.countryTags ||
        prevState.typeTags !== this.state.typeTags ||
        prevState.tasteTags !== this.state.tasteTags ||
        prevState.activeFilter !== this.state.activeFilter ||
        prevState.showTips !== this.state.showTips) {
      this.updateFilterItems();
      this.updateGinItems();
      this.updateFilterVisibility();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFilterVisibility);
  }
  
  render() {
    const countryTags = this.getCountryFilterOptions();
    const ginTypeTags = this.getGinTypeFilterOptions();
    const tasteTags = this.getTasteFilterOptions();

    return (
      <section className="fixed_width masonry_wrap">
        <div class="padding_for_filter">
          <div className={this.state.activeFilter ? "filter_wrapper active" : "filter_wrapper"}>
            <div className='filterButton clearfix' onClick={this.toggleFilter.bind(this)}>
              <span>Filtern:  <span>{this.state.activeItems} Gins ausgewählt</span></span>
              <div className='filterIcon'>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="filters">
              <div className='toggleSwitch'>
                <span>Tipps:</span>
                <Switch onChange={this.updateShowTips.bind(this)} checked={this.state.showTips}
                  width={50}
                  height={22}
                  borderRadius={11}
                  onColor='#f5f5f5'
                  offColor='#313131'
                  onHandleColor='#303030'
                  offHandleColor='#8e8e8e'
                  uncheckedIcon={false}
                  checkedIcon={false} 
                  className="showTipsSwitch" />
              </div>
              <div>
                <span>Herkunftsland:</span>
                <ul className='filter'>
                  {countryTags.map(country => (
                    <li key={country} id={country} className="filterItem" onClick={this.updateActiveFilters.bind(this, country, "country")}>{country}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>Gin Sorte:</span>
                <ul className='filter'>
                  {ginTypeTags.map(ginType => (
                    <li key={ginType} id={ginType} className="filterItem" onClick={this.updateActiveFilters.bind(this, ginType, "ginType")}>{ginType}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>Hauptnote:</span>
                <ul className='filter'>
                  {tasteTags.map(taste => (
                    <li key={taste} id={taste} className="filterItem" onClick={this.updateActiveFilters.bind(this, taste, "taste")}>{taste}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid">
          {this.props.gins.map(gin => {
                let tagsList = [gin.originCountry, gin.type];
                tagsList = [...tagsList, ...gin.mainNote];
                return (
                  <div className='grid-item' tags={tagsList} key={gin.id} data-tipp={gin.recommendation}>
                    <GinOverviewTile
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

export default NoMasonryLayout;
