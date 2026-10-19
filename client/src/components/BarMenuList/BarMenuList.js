import React from 'react';
import './BarMenuList.scss';
import BarMenuItem from '../BarMenuItem/BarMenuItem';
import RecipesData from '../../data/cocktail-recipes.json';
import BarMenuListItemDetail from '../BarMenuListItemDetail/BarMenuListItemDetail';
import '../noMasonryLayout/noMasonryLayout.scss';
import Switch from "react-switch";
import CocktailGuide from '../CocktailGuide/CocktailGuide';
import { INGREDIENT_GROUPS, OTHER_GROUP, getIngredientGroup, getFilterLabel, isNonAlcoholic } from './cocktailLogic';

class BarMenuList extends React.Component {
  state = {
    selectedRecipe: null,
    selectedIngredients: new Set(),
    nonAlcoholicOnly: false,
    guideOpen: false,
    activeFilter: window.innerWidth > 1260
  };

  groupIngredients = (ingredients) => {
    const groups = [...INGREDIENT_GROUPS.map(([name]) => name), OTHER_GROUP]
      .map(name => ({ name, ingredients: [] }));
    ingredients.forEach(ingredient => {
      groups.find(group => group.name === getIngredientGroup(ingredient)).ingredients.push(ingredient);
    });
    return groups.filter(group => group.ingredients.length > 0);
  };

  toggleFilter = () => {
    // Auf großen Screens ist der Filter immer offen (wie auf der Gin-Seite)
    if (window.innerWidth > 1260) return;
    this.setState(prevState => ({ activeFilter: !prevState.activeFilter }));
  };

  updateFilterVisibility = () => {
    if (window.innerWidth > 1260) {
      this.setState({ activeFilter: true });
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateFilterVisibility);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFilterVisibility);
  }

  extractUniqueIngredients = (recipes) => {
    const ingredients = new Set();
    recipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ing => {
          if (ing.ingredient && ing.unit === 'oz' && ing.amount && Number(ing.amount) >= 0.5) {
            ingredients.add(getFilterLabel(ing.ingredient));
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
      const recipeIngredients = new Set(recipe.ingredients.map(i => getFilterLabel(i.ingredient || '')));
      // Wie bei den Gins: innerhalb einer Gruppe ODER, zwischen Gruppen UND
      const selectedByGroup = this.groupIngredients(Array.from(selectedIngredients));
      return selectedByGroup.every(group => group.ingredients.some(selected => recipeIngredients.has(selected)));
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
    const locked = this.state.overlayVisible || this.state.guideOpen;
    const wasLocked = prevState.overlayVisible || prevState.guideOpen;
    if (locked && !wasLocked) {
      document.body.classList.add('no-scroll');
    } else if (!locked && wasLocked) {
      document.body.classList.remove('no-scroll');
    }
  }

  handleGuideSelect = (recipe) => {
    this.setState({ guideOpen: false });
    this.handleItemClick(recipe);
  };

  render() {
    const data = [...RecipesData].sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    const { selectedRecipe, overlayVisible, selectedIngredients, activeFilter, nonAlcoholicOnly, guideOpen } = this.state;
    const ingredientGroups = this.groupIngredients(this.extractUniqueIngredients(data));
    const filteredData = this.filterRecipesByIngredients(data, selectedIngredients)
      .filter(recipe => !nonAlcoholicOnly || isNonAlcoholic(recipe));

    return ( 
      <section className="fixed_width masonry_wrap bar_menu_filter">
        <div className="padding_for_filter">
          <button className="guide-trigger" onClick={() => this.setState({ guideOpen: true })}>
            Not sure? <span>Let us pick for you</span>
          </button>
          <div className={activeFilter ? "filter_wrapper active" : "filter_wrapper"}>
            <div className='filterButton clearfix' onClick={this.toggleFilter}>
              <span>Filter:  <span>{filteredData.length} cocktails selected</span></span>
              <div className='filterIcon'>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="filters">
              <div className='toggleSwitch'>
                <span>Non-alc:</span>
                <Switch onChange={() => this.setState(prevState => ({ nonAlcoholicOnly: !prevState.nonAlcoholicOnly }))}
                  checked={nonAlcoholicOnly}
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
              {ingredientGroups.map(group => (
                <div key={group.name}>
                  <span>{group.name}:</span>
                  <ul className='filter'>
                    {group.ingredients.map(ingredient => (
                      <li
                        key={ingredient}
                        className={selectedIngredients.has(ingredient) ? 'filterItem active' : 'filterItem'}
                        onClick={() => this.toggleIngredientFilter(ingredient)}
                      >
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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

        {guideOpen && (
          <CocktailGuide
            recipes={data}
            onSelect={this.handleGuideSelect}
            onClose={() => this.setState({ guideOpen: false })}
          />
        )}

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
