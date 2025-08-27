import React from 'react';
import './BarMenuList.scss';
import BarMenuItem from '../BarMenuItem/BarMenuItem';
import RecipesData from '../../data/cocktail-recipes.json';
import BarMenuListItemDetail from '../BarMenuListItemDetail/BarMenuListItemDetail';

class BarMenuList extends React.Component {
  state = {
    selectedRecipe: null
  };

  handleItemClick = (recipe) => {
    this.setState({ selectedRecipe: recipe }, () => {
      setTimeout(() => {
        this.setState({ overlayVisible: true });
      }, 10); // short delay to trigger CSS transition
    });
  };

  handleCloseOverlay = () => {
     this.setState({ overlayVisible: false });
    setTimeout(() => {
      this.setState({ selectedRecipe: null });
    }, 250); // match your CSS transition duration
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.overlayVisible && !prevState.overlayVisible) {
      document.body.classList.add('no-scroll');
    } else if (!this.state.overlayVisible && prevState.overlayVisible) {
      document.body.classList.remove('no-scroll');
    }
  }

  render() {
    const data = [...RecipesData].sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    const { selectedRecipe, overlayVisible } = this.state;

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
            visible={overlayVisible}
            selectedRecipe={this.state.selectedRecipe}
            handleCloseOverlay={this.handleCloseOverlay}
          />
        )}
      </section>
    );
  }
}
  
export default BarMenuList;
