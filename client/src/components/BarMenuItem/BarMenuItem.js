import React from 'react';
import './BarMenuItem.scss';

class BarMenuItem extends React.Component {
  render(){
    return(
      <section class="recipe-item" id={this.props.id} onClick={this.props.onClick}>
        <span class="recipe-title">{this.props.title}</span>
          <div class="seperator"/>
          <div class="recipe-ingredients">
          {this.props.ingredients.map((ingredient) =>
            <span class="simple_text">{ingredient.ingredient}</span>
          )}
        </div>
      </section>
    )
  }
};

export default BarMenuItem;
