import React from 'react';
import './TagsList.scss';

function TagsList({tags, inverted}) {
  return (
    <div className={inverted ? "tags_list clearfix inverted" : "tags_list clearfix"}>
      {tags.map(tag => (
          <span>{tag}</span>
      ))}
    </div>
  );
}

export default TagsList;
