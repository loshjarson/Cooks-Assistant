import React from "react"


import { CardHeader, CardMedia, IconButton, Card, CardContent, Typography, Menu, MenuItem } from "@mui/material";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Popover, Tag } from "antd";

import { colorTag, colorText } from "./helpers/helpers";

import { useSelector, useDispatch, batch } from "react-redux";
import { setFocusedRecipe, selectFilteredRecipeById} from "./slices/recipesSlice";
import { setDragging } from "./slices/draggableSlice";
import { setModal } from "./slices/modalsSlice";
import { bindMenu, bindTrigger } from "material-ui-popup-state";
import { usePopupState } from "material-ui-popup-state/hooks";

const RecipeCard = React.memo(({recipeId}) => {
    const dispatch = useDispatch()
    const recipe = useSelector((state) => selectFilteredRecipeById(state,recipeId))
    const popupState = usePopupState({ variant: 'popover', popupId: recipeId })

    if(recipe){
        const overflowDescriptionContent = (<div style={{width:"15rem", height:"10rem", overflow:"scroll", padding:"6px"}} >{recipe.description}</div>)

        return ( 
                <Card 
                    key={recipeId}
                    style={{ width: 345, margin:"1rem", cursor:"pointer" }} 
                    draggable 
                    onDragStart={()=>dispatch(setDragging(recipeId))} 
                    onClick={() => {
                            batch(()=>{
                                dispatch(setFocusedRecipe(recipeId)); 
                                dispatch(setModal({viewingRecipe:true}))
                            })
                            
                        }}
                    >
                    <CardHeader
                        title= {recipe.name}
                        subheader={<p style={{fontSize:"14.25px", margin:"0"}}>prep: {recipe.prepTime}min | cook: {recipe.cookTime}min | total: {recipe.totalTime}min</p>}
                        action={<div
                                    onClick={(e)=>{
                                            console.log(e)
                                            e.cancelBubble = true;
                                            if (e.stopPropagation) e.stopPropagation();
                                            dispatch(setFocusedRecipe(recipeId))}}
                                >
                                    <IconButton {...bindTrigger(popupState)}>                                      
                                        <MoreOutlined/>
                                    </IconButton>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={()=>{ popupState.close()
                                            dispatch(setModal({editingRecipe:true}))
                                        }}><EditOutlined style={{marginRight:"1rem"}}/> Edit Recipe</MenuItem>
                                        <MenuItem onClick={()=>{ popupState.close()
                                            dispatch(setModal({deletingRecipe:true}))
                                        }}><DeleteOutlined style={{marginRight:"1rem"}}/> Delete Recipe</MenuItem>
                                    </Menu>
                                </div>}
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