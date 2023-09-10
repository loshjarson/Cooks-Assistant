import React from "react"


import { CardHeader, CardMedia, IconButton, Card, CardContent, Typography, Menu, MenuItem } from "@mui/material";
import { DeleteOutlined, EditOutlined, MinusCircleOutlined, MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Popover, Tag } from "antd";

import { colorTag, colorText } from "./helpers/helpers";

import { useSelector, useDispatch, batch } from "react-redux";
import { setFocusedRecipe, selectFilteredRecipeById, pullRecipe} from "./slices/recipesSlice";
import { setDragging } from "./slices/draggableSlice";
import { setModal } from "./slices/modalsSlice";
import { bindMenu, bindTrigger } from "material-ui-popup-state";
import { usePopupState } from "material-ui-popup-state/hooks";
import { editList, selectFocusedList } from "./slices/listsSlice";
import { selectFocusedUserId } from "./slices/usersSlice";

const RecipeCard = React.memo(({recipeId}) => {
    const dispatch = useDispatch()
    const recipe = useSelector((state) => selectFilteredRecipeById(state,recipeId))
    const list = useSelector(selectFocusedList)
    const popupState = usePopupState({ variant: 'popover', popupId: recipeId })
    const user = useSelector(selectFocusedUserId)

    if(recipe){
        const overflowDescriptionContent = (<div className="description-overflow" >{recipe.description}</div>)

        return ( 
                <Card 
                    key={recipeId}
                    className="recipe-card"
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
                                    
                                        {user ? 
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={()=>{popupState.close()
                                                    dispatch(pullRecipe(recipe._id))
                                                }}><PlusCircleOutlined style={{marginRight:"1rem"}}/> Add to Your Recipes </MenuItem>
                                            </Menu>
                                        : <Menu {...bindMenu(popupState)}>
                                            <MenuItem onClick={()=>{ popupState.close()
                                                dispatch(setModal({editingRecipe:true}))
                                            }}><EditOutlined style={{marginRight:"1rem"}}/> Edit Recipe</MenuItem>
                                            {list ? 
                                                <MenuItem 
                                                    onClick={()=>{ popupState.close()
                                                    dispatch(editList([null,list,null,recipe._id]))
                                                }}>
                                                    <MinusCircleOutlined style={{marginRight:"1rem"}}/> Remove From List</MenuItem>
                                                : null
                                            }
                                            <MenuItem onClick={()=>{ popupState.close()
                                                dispatch(setModal({deletingRecipe:true}))
                                            }}><DeleteOutlined style={{marginRight:"1rem"}}/> Delete Recipe</MenuItem>
                                        </Menu>
                                        }
                                        
                                    
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
                        <div className="tag-container">
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