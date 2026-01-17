import React from 'react';
import './BarMenuList.scss';
import BarMenuItem from '../BarMenuItem/BarMenuItem';
import RecipesData from '../../data/cocktail-recipes.json';
import BarMenuListItemDetail from '../BarMenuListItemDetail/BarMenuListItemDetail';

class BarMenuList extends React.Component {
  state = {
    selectedRecipe: null,
    selectedIngredients: new Set()
  };

  extractUniqueIngredients = (recipes) => {
    const ingredients = new Set();
    recipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ing => {
          if (ing.ingredient && ing.unit === 'oz' && ing.amount && Number(ing.amount) >= 0.5) {
            ingredients.add(ing.ingredient);
          }
        });
      }
    });
    return Array.from(ingredients).sort((a, b) => a.localeCompare(b));
  };

  toggleIngredientFilter = (ingredient) => {
    this.setState(prevState => {
      const newSelected = new Set(prevState.selectedIngredients);
      if (newSelected.has(ingredient)) {
        newSelected.delete(ingredient);
      } else {
        newSelected.add(ingredient);
      }
      return { selectedIngredients: newSelected };
    });
  };

  filterRecipesByIngredients = (recipes, selectedIngredients) => {
    if (selectedIngredients.size === 0) {
      return recipes;
    }
    return recipes.filter(recipe => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
        return false;
      }
      const recipeIngredients = new Set(recipe.ingredients.map(i => i.ingredient));
      return Array.from(selectedIngredients).some(selected => recipeIngredients.has(selected));
    });
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
    const { selectedRecipe, overlayVisible, selectedIngredients } = this.state;
    const allIngredients = this.extractUniqueIngredients(data);
    const filteredData = this.filterRecipesByIngredients(data, selectedIngredients);

    return ( 
      <section className="fixed_width">
        <div className="ingredient-filter">
          <div className="filter-buttons">
            {allIngredients.map(ingredient => (
              <button
                key={ingredient}
                className={`filter-btn ${selectedIngredients.has(ingredient) ? 'active' : ''}`}
                onClick={() => this.toggleIngredientFilter(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
        <div className="bar-menu-list">
          {filteredData.map((recipe, index) =>
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
