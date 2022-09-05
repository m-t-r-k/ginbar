import React from 'react';
import './Button.scss';

const Button = (props) => (
  <div className="linkButton">
    <a href={props.link} target={props.targetBlank ? "_blank" : "_self"} className={props.affiliateLink ? "affiliateLink" : ""}>{props.text}</a>
  </div>
);

export default Button;
