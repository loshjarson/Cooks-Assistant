import React, { useState } from 'react';
import { Slider, Box, Button } from '@mui/material'
import { Tag, Typography } from 'antd';
import { AddOutlined } from '@mui/icons-material';

function valuetext(value) {
    return `${value} min`;
  }

//minimum distance between slider sides
const minDistance = 10;

const valueLabelFormat = (value) => {
        if(value === 90) {
            return '+90 min'
        } else {
            return `${value} min`
        }
    }

function Filter({filterValues,setFilterValues,tagsInFilter,ingredientsInFilter, addedTags, setAddedTags, addedIngredients, setAddedIngredients}) {
    const [prepTime, setPrepTime] = useState([0,Infinity])
    const [cookTime, setCookTime] = useState([0,Infinity])
    const [totalTime, setTotalTime] = useState([0,Infinity])
    
    const handleSlider = (oldValue, newValue, activeThumb, changeValue, name) => {
        if (!Array.isArray(newValue)) {
          return;
        }
        //keep thumbs seperated by specified distance
        if (activeThumb === 0) {
          changeValue([Math.min(newValue[0], oldValue[1] - minDistance), oldValue[1]]);
        } else {
          changeValue([oldValue[0], Math.max(newValue[1], oldValue[0] + minDistance)]);
        }
        if(newValue[1] === 90 ) newValue[1] = Infinity 
        if(newValue[1] === 0 ) newValue[1] = 10
        
        setFilterValues({...filterValues, [name]:newValue})
      };

    const handleIngredientChange = (ingredient) => {
        if (addedIngredients.includes(ingredient)) setAddedIngredients([...addedIngredients.filter(addedIngredient => addedIngredient !== ingredient)])
        else setAddedIngredients([...addedIngredients,ingredient])
        
    }

    const handleTagChange = (tag) => {
        if(addedTags.includes(tag)) setAddedTags([...addedTags.filter(addedTag => addedTag !== tag)]) 
        else setAddedTags([...addedTags,tag])
    }

    return ( 
    <div style={{width:"30rem", display:"flex"}}>
        <Box sx={{ width: "15rem", margin:"auto" }}>
            <Typography>Prep Time:</Typography>
            <Slider
                getAriaLabel={() => 'Prep Time'}
                value={prepTime}
                max={90}
                valueLabelFormat={(value)=>valueLabelFormat(value)}
                onChange={(e, newValue, activeThumb) => {handleSlider(prepTime, newValue, activeThumb, setPrepTime,"prepTime")}}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
            />
            <Typography>Cook Time:</Typography>
            <Slider
                getAriaLabel={() => 'Cook time'}
                value={cookTime}
                max={90}
                valueLabelFormat={(value)=>valueLabelFormat(value,"cookTime")}
                onChange={(e, newValue, activeThumb) => {handleSlider(cookTime, newValue, activeThumb, setCookTime,"cookTime")}}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
            />
            <Typography>Total Time:</Typography>
            <Slider
                getAriaLabel={() => 'Total time'}
                value={totalTime}
                max={90}
                valueLabelFormat={(value)=>valueLabelFormat(value,"totalTime")}
                onChange={(e, newValue, activeThumb) => {handleSlider(totalTime, newValue, activeThumb, setTotalTime,"totalTime")}}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
            />
        </Box>
        <Box sx={{display:"flex", flexDirection:"column", justifyContent:"space-evenly"}}>
            <Box sx={{border:"1px solid grey", height:"45%",width:"12.5rem", borderRadius:"10px", overflow:"scroll"}}>
                {tagsInFilter.map(tag => {
                    return(
                        <Tag color={addedTags.includes(tag) ? "green" : ""} style={{cursor:"pointer"}} onClick={()=>handleTagChange(tag)}>{tag}</Tag>
                    )
                })}
            </Box>
            <Box sx={{border:"1px solid grey", height:"45%",width:"12.5rem", borderRadius:"10px", overflow:"scroll"}}>
                {ingredientsInFilter.map(ingredient => {
                    return(
                        <Tag color={addedIngredients.includes(ingredient) ? "green" : ""} style={{cursor:"pointer"}} onClick={()=>handleIngredientChange(ingredient)}>{ingredient}</Tag>
                    )
                })}
            </Box>
        </Box>
    </div>
     );
}

export default Filter;