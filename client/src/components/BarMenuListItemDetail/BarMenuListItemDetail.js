import React from 'react';
import PropTypes from 'prop-types';
import './BarMenuListItemDetail.scss';

const decimalToFraction = (num) => {
  const fractions = {
    0.25: '¼',
    0.5: '½',
    0.75: '¾',
    1.25: '1¼',
    1.5: '1½',
    1.75: '1¾',
    2.25: '2¼',
    2.5: '2½',
    2.75: '2¾'
  };
  return fractions[num] || num;
};

const highlightKeyWord = (string) => {
  return string.split(' ').map((word, i) => {
    if (word === word.toUpperCase() && word.match(/[A-Z]/)) {
      return <span>{word} </span>;
    }
    return word + ' ';
  });
};

const BarMenuListItemDetail = (props) => (
  <div class="fullscreen_overlay">
    <div class="overlay_wrapper fixed_width">
      <div class="close-btn" onClick={props.handleCloseOverlay}><span></span><span></span></div>
      <div class="overlay_content">
        <h2>{props.selectedRecipe.title}</h2>
        <div>
          <div>
            <ul>
              {props.selectedRecipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span>{decimalToFraction(ing.amount)}</span>
                   {ing.unit !== "" && <span>{ing.unit}</span>}
                  {ing.ingredient}
                </li>
              ))}
            </ul>
          </div>
          <p class="simple_text">{highlightKeyWord(props.selectedRecipe.instructions)}</p>
        </div>
      </div>
    </div>
    <div class="bg" onClick={props.handleCloseOverlay}></div>
  </div>
);

export default BarMenuListItemDetail;
