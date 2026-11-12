import React, { useEffect, useState } from 'react';
import GinOverviewTile from '../GinOverviewTile/GinOverviewTile.js';
import './GinList.scss';
import Switch from "react-switch";
import { getFilterOptions, filterGins } from './ginFilterLogic';

const LARGE_SCREEN = 1260;
const FILTER_GROUPS = [
  ['country', 'Herkunftsland'],
  ['type', 'Gin Sorte'],
  ['taste', 'Hauptnote'],
];

function GinList({ gins }) {
  const [selected, setSelected] = useState({ country: [], type: [], taste: [] });
  const [showTips, setShowTips] = useState(false);
  const [activeFilter, setActiveFilter] = useState(window.innerWidth > LARGE_SCREEN);

  // Auf großen Screens ist der Filter immer offen
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > LARGE_SCREEN) setActiveFilter(true); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleFilter = () => {
    if (window.innerWidth > LARGE_SCREEN) return;
    setActiveFilter(active => !active);
  };

  const toggleTag = (category, tag) => setSelected(prev => ({
    ...prev,
    [category]: prev[category].includes(tag) ? prev[category].filter(t => t !== tag) : [...prev[category], tag],
  }));

  const options = getFilterOptions(gins);
  const filteredGins = filterGins(gins, selected, showTips);

  return (
    <section className="fixed_width masonry_wrap">
      <div className="padding_for_filter">
        <div className={activeFilter ? "filter_wrapper active" : "filter_wrapper"}>
          <div className='filterButton clearfix' onClick={toggleFilter}>
            <span>Filtern:  <span>{filteredGins.length} Gins ausgewählt</span></span>
            <div className='filterIcon'>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="filters">
            <div className='toggleSwitch'>
              <span>Tipps:</span>
              <Switch onChange={() => setShowTips(on => !on)} checked={showTips}
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
            {FILTER_GROUPS.map(([category, label]) => (
              <div key={category}>
                <span>{label}:</span>
                <ul className='filter'>
                  {options[category].map(tag => (
                    <li key={tag}
                      className={selected[category].includes(tag) ? "filterItem active" : "filterItem"}
                      onClick={() => toggleTag(category, tag)}>{tag}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid">
        {filteredGins.map((gin, index) => {
          const tagsList = [gin.originCountry, gin.type, ...gin.mainNote];
          return (
            <div className='grid-item' key={gin.id}>
              <GinOverviewTile
                lazy={!(index < 4)}
                id={gin.id}
                name={gin.name}
                imageBottle={gin.imageBottle}
                imageMoodPicSmall={gin.imageMoodPicSmall}
                tags={tagsList}
                recommendation={gin.recommendation}></GinOverviewTile>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GinList;
