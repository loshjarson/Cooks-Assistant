import React from "react"

import RecipeOptions from "./RecipeOptions";

import { CardHeader, CardMedia, IconButton, Card, CardContent, Typography } from "@mui/material";
import { MoreOutlined } from "@ant-design/icons";
import { Popover, Tag } from "antd";

import { colorTag, colorText } from "./helpers/helpers";

import { useSelector, useDispatch, batch } from "react-redux";
import { setFocusedRecipe, selectFilteredRecipeById} from "./slices/recipesSlice";
import { setDragging } from "./slices/draggableSlice";
import { setModal } from "./slices/modalsSlice";

const RecipeCard = React.memo(({recipeId}) => {
    const dispatch = useDispatch()
    const recipe = useSelector((state) => selectFilteredRecipeById(state,recipeId))

    if(recipe){
        const overflowDescriptionContent = (<div style={{width:"15rem", height:"10rem", overflow:"scroll", padding:"6px"}} >{recipe.description}</div>)

        return ( 
                <Card 
                    key={recipe._id}
                    style={{ width: 345, margin:"1rem", cursor:"pointer" }} 
                    draggable 
                    onDragStart={()=>dispatch(setDragging(recipe._id))} 
                    onClick={() => {
                            batch(()=>{
                                dispatch(setFocusedRecipe(recipe._id)); 
                                dispatch(setModal({viewingRecipe:true}))
                            })
                            
                        }}
                    >
                    <CardHeader
                        title= {recipe.name}
                        subheader={<p style={{fontSize:"14.25px", margin:"0"}}>prep: {recipe.prepTime}min | cook: {recipe.cookTime}min | total: {recipe.totalTime}min</p>}
                        action={
                            <Popover 
                                content={<RecipeOptions recipe={recipe}/> }  
                                placement="rightTop" 
                                trigger="focus"
                            >
                                <IconButton 
                                    onClick={(e)=>{
                                        e.cancelBubble = true;
                                        if (e.stopPropagation) e.stopPropagation();
                                        dispatch(setFocusedRecipe(recipe._id))
                                    }}
                                >                                                
                                    <MoreOutlined/>
                                </IconButton> 
                            </Popover>
                            
                        }
                    />
                    <CardMedia 
                    component="img"
                    height="194"
                    src={recipe.image}/>
                    <CardContent>
                        <Typography style={{height:"45px"}}>
                            {recipe.description.length > 80 ? recipe.description.substring(0,80) : recipe.description }
                            {recipe.description.length > 80 ? <Popover content={overflowDescriptionContent}>...</Popover> : null}
                        </Typography>
                        <div style={{height:"25px", display:"flex", width:"100%", overflow:"auto", margin:".5rem auto auto auto", whiteSpace:"nowrap", paddingBottom:"15px"}}>
                            {recipe.tags.map(tag => {
                                const background = colorTag(tag)
                                return(
                                    <Tag key={tag} color={background} style={{color:colorText(background)}}>
                                        {tag}
                                    </Tag>
                                )
                            })}
                        </div>
                        </CardContent>
                </Card>
            )
    } else return null
    
},(prevProps,nextProps)=>{
   return prevProps.recipe === nextProps.recipe && prevProps.recipeImage === nextProps.recipeImage
})


export default RecipeCard;