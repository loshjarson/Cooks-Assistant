import React from 'react';

import { Typography } from '@mui/material';
import { Tag, List } from 'antd';
import VirtualList from "rc-virtual-list";
import { colorTag, colorText } from './helpers/helpers';

import { useSelector } from 'react-redux';
import { selectFocusedRecipe, selectRecipeById } from './slices/recipesSlice';



function RecipeView () {
    const recipeId = useSelector(selectFocusedRecipe)
    const recipe = useSelector(state => selectRecipeById(state, recipeId))

    //conditional render to address bug of error if focused recipe is empty
    if(recipe){
    return ( <div>
            <Typography variant='h2' align='center'>{recipe.name}</Typography>
            <div style={{width:"fit-content", margin:"auto", display:"flex", flexFlow:"row wrap", justifyContent:"center"}}>
                {recipe.tags.map((tag) => {
                    return(
                    <Tag color={colorTag(tag)} key={tag} style={{color:colorText(colorTag(tag)), margin:"auto .5rem 1rem .5rem"}}>
                        {tag}
                    </Tag>
                    )
                })}
            </div>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <div style={{width:"60%", margin:"auto 0", height:"100%" }}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", margin:"0 auto auto auto", width:"60%"}}>
                        <Typography id="prep-time" name="prepTime" >Prep time: {recipe.prepTime} min</Typography>

                        <Typography id="cook-time" name="cookTime" >Cook time: {recipe.cookTime} min</Typography>

                        <Typography id="total-time" name="totalTime">Total time: {recipe.totalTime} min</Typography>

                        <Typography id="servings" name="servings">Servings: {recipe.servings}</Typography> 
                    </div>
                   <div style={{height:"14rem", overflow:"auto", margin:"4rem auto"}} label="Description">
                    
                        <Typography id="description" name="description">
                            {recipe.description}
                        </Typography>
                    </div> 
                </div>
                
                <div label="Recipe Image" style={{width:"30%"}}>
                    <img src={recipe.image} alt="recipe preview" style={{width:"80%", maxHeight:"20rem", objectFit:"cover"}} />
                </div>
            </div>
            
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", marginTop:"1rem"}}>
                <div style={{width:"45%"}}>
                    <div label="Ingredients" style={{width:"100%"}}>
                        <List style={{border:"1px solid grey", padding:"0 1rem", borderRadius:"10px"}} rowKey={(t)=> recipe.ingredients[t].name}>
                            <VirtualList
                                id="ingredients" 
                                name="ingredients" 
                                data={recipe.ingredients}
                                height={200}
                            >
                                {(ingredient) => (
                                    <List.Item rowKey={ingredient.name}>
                                        <List.Item.Meta
                                            avatar={ingredient.amount + " " + ingredient.unit}
                                            title={ingredient.name}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </div>
                </div>
                <div style={{width:"45%"}}>
                    <div label="Instructions" style={{width:"100%"}}>
                        <List style={{border:"1px solid grey", padding:"0 1rem", borderRadius:"10px"}} rowKey={(t)=> t}>
                            <VirtualList
                                id="instructions-list" 
                                name="instructions" 
                                data={Object.keys(recipe.instructions)}
                                height={200}
                            >
                                {(stepNumber) => (
                                    <List.Item >
                                        <List.Item.Meta
                                            avatar={stepNumber}
                                            description={recipe.instructions[stepNumber]}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </div>
                </div>
            </div>
            
    </div> ); } else return null
}

export default RecipeView ;