import React from 'react';

import { Typography } from '@mui/material';
import { Tag, Divider } from 'antd';
import { colorTag, colorText } from './helpers/helpers';

import { useSelector } from 'react-redux';
import { selectFocusedRecipe, selectRecipeById } from './slices/recipesSlice';


function RecipeView () {
    const recipeId = useSelector(selectFocusedRecipe)
    const recipe = useSelector(state => selectRecipeById(state, recipeId))

    //conditional render to address bug of error if focused recipe is empty
    if(recipe){
    return ( <div id="recipe-view">
            <Typography variant='h2' align='center'>{recipe.name}</Typography>
            <div id="tags-container">
                {recipe.tags.map((tag) => {
                    return(
                    <Tag color={colorTag(tag)} key={tag} style={{color:colorText(colorTag(tag)), margin:"auto .5rem 1rem .5rem"}}>
                        {tag}
                    </Tag>
                    )
                })}
            </div>
            <div id="top-section">
                <div id="time-servings-and-description">
                    <div id="time-and-servings">
                        <Typography id="prep-time" className='amount' name="prepTime" >Prep: <br/>{recipe.prepTime} min</Typography>
                        <Divider type="vertical" style={{height:"auto"}}/>
                        <Typography id="cook-time" className='amount' name="cookTime" >Cook: <br/>{recipe.cookTime} min</Typography>
                        <Divider type="vertical" style={{height:"auto"}}/>
                        <Typography id="total-time" className='amount' name="totalTime">Total: <br/>{recipe.totalTime} min</Typography>
                        <Divider type="vertical" style={{height:"auto"}}/>
                        <Typography id="servings" className='amount' name="servings">Servings: <p>{recipe.servings}</p></Typography> 
                    </div>
                   <div id="description-container" label="Description">
                    
                        <Typography id="description" name="description">
                            {recipe.description}
                        </Typography>
                    </div> 
                </div>
                
                <div label="Recipe Image" id="recipe-image-container">
                    <img src={recipe.image} id="recipe-image" alt="recipe preview"/>
                </div>
            </div>
            
            <div id="ingredients-and-instructions">
                <Typography variant='h2' align='center'>Ingredients</Typography>
                <Divider/>
                <div id="ingredients-list-container" name="ingredients" >
                    {
                        recipe.ingredients.map((ingredient) => (
                            <div className='list-item'>
                                {ingredient.amount + " " + ((ingredient.amount < 2 || ingredient.unit.length === 0) ? ingredient.unit:ingredient.unit+"s")}
                                <span style={{marginRight:"25px"}}/>
                                {ingredient.name}
                            </div>))
                    }
                </div>
                <Typography variant='h2' align='center'>Instructions</Typography>
                <Divider/>
                <div id="instructions-list-container" name="instructions" >
                    {
                        Object.keys(recipe.instructions).map((stepNumber) => (
                            <div className='list-item' style={{width:"100%"}}>
                                {stepNumber}
                                <span style={{marginRight:"25px"}}/>
                                {recipe.instructions[stepNumber]}
                            </div>))
                    }
                </div>
            </div>
            
    </div> ); } else return null
}

export default RecipeView ;