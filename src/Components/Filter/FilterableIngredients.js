import { Tag } from 'antd';
import { selectFilterableIngredients, selectSelectedIngredients, setSelectedIngredients } from '../slices/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

function FilterableIngredients() {
    const dispatch = useDispatch()
    const selectedIngredients = useSelector(selectSelectedIngredients)
    const filterableIngredients = useSelector(selectFilterableIngredients)

    const handleIngredientChange = (ingredient) => {
        if (selectedIngredients.includes(ingredient)) dispatch(setSelectedIngredients([...selectedIngredients.filter(selectedIngredient => selectedIngredient !== ingredient)]));
        else dispatch(setSelectedIngredients([...selectedIngredients, ingredient]))
    
    }
    return ( 
        filterableIngredients.map(ingredient => {
            return (
              <Tag key={ingredient} color={selectedIngredients.includes(ingredient) ? "green" : ""} style={{ cursor: "pointer", height:"min-content", margin:"3px"}} onClick={() => handleIngredientChange(ingredient)}>{ingredient}</Tag>
            )
          })
     );
}

export default FilterableIngredients;