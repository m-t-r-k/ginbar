import React from 'react';
import PropTypes from 'prop-types';
import './BarMenuList.scss';
import BarMenuItem from '../BarMenuItem/BarMenuItem';
import RecipesData from '../../data/cocktail-recipes.json';
import BarMenuListItemDetail from '../BarMenuListItemDetail/BarMenuListItemDetail';

class BarMenuList extends React.Component {
  state = {
    selectedRecipe: null
  };

  handleItemClick = (recipe) => {
    this.setState({ selectedRecipe: recipe });
  };

  handleCloseOverlay = () => {
    this.setState({ selectedRecipe: null });
  };

  render() {
    const data = RecipesData;
    const { selectedRecipe } = this.state;

    return ( 
      <section className="fixed_width">
        <div class="bar-menu-list">
          {data.map((recipe, index) =>
            <BarMenuItem 
              key={index}
              id={recipe.id}
              title={recipe.title}
              ingredients={recipe.ingredients} 
              onClick={() => this.handleItemClick(recipe)}
            />
          )}
        </div>

        {selectedRecipe && (
          <BarMenuListItemDetail 
            selectedRecipe={this.state.selectedRecipe}
            handleCloseOverlay={this.handleCloseOverlay}
          />
        )}
      </section>
    );
  }
}
  
export default BarMenuList;
