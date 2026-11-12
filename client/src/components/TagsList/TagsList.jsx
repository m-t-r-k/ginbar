import React from 'react';
import './TagsList.scss';

function TagsList({tags, inverted}) {
  return (
    <div className={inverted ? "tags_list clearfix inverted" : "tags_list clearfix"}>
      {tags.map(tag => (
        tag ? <span key={tag}>{tag}</span> : ""
      ))}
    </div>
  );
}

export default TagsList;
