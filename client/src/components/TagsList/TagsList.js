import React from 'react';
import './TagsList.scss';

function TagsList({tags}) {
  return (
    <div className="tags_list clearfix">
      {tags.map(tag => (
          <span>{tag}</span>
      ))}
    </div>
  );
}

export default TagsList;
