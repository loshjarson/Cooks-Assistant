
import { Tag } from 'antd';
import { selectFilterableTags, selectSelectedTags, setSelectedTags } from '../slices/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

function FilterableTags() {
    const dispatch = useDispatch()
    const selectedTags = useSelector(selectSelectedTags)
    const filterableTags = useSelector(selectFilterableTags)

    const handleTagChange = (tag) => {
        if (selectedTags.includes(tag)) dispatch(setSelectedTags([...selectedTags.filter(selectedTag => selectedTag !== tag)]));
        else dispatch(setSelectedTags([...selectedTags, tag]))
    
    }
    return ( 
        filterableTags.map(tag => {
            return (
              <Tag key={tag} color={selectedTags.includes(tag) ? "green" : ""} style={{ cursor: "pointer", height:"min-content", margin:"3px"}} onClick={() => handleTagChange(tag)}>{tag}</Tag>
            )
          })
     );
}

export default FilterableTags;