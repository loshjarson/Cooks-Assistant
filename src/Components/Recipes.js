import React, { useEffect, useState } from "react";

import { Divider, IconButton, Paper, Typography } from "@mui/material";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Popover } from "antd";


import NewRecipe from "./RecipeForm";
import RecipeView from "./RecipeView";
import Filter from "./Filter/Filter";
import RecipeSearch from "./Filter/RecipeSearch";
import RecipeCard from "./RecipeCard";

import { useSelector, useDispatch, batch } from "react-redux";
import { deleteRecipe, fetchFilteredRecipes, selectFocusedRecipeObj, selectRecipeIds, selectRecipesStatus, setFocusedRecipe } from "./slices/recipesSlice";
import { selectFilterStatus } from "./slices/filterSlice";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { addList, deleteList, selectFocusedListName, selectListsStatus } from "./slices/listsSlice";
import { selectFocusedUser } from "./slices/usersSlice";
import { debounce } from "lodash";




function Recipes() {

    const dispatch = useDispatch()

    const debouncedFilter = debounce(dispatch)

    const creatingRecipe = useSelector(state =>selectModalByName(state,"creatingRecipe"))
    const editingRecipe = useSelector(state =>selectModalByName(state,"editingRecipe"))
    const deletingRecipe = useSelector(state =>selectModalByName(state,"deletingRecipe"))
    const viewingRecipe = useSelector(state => selectModalByName(state, "viewingRecipe"))
    const creatingList = useSelector(state => selectModalByName(state, "creatingList"))
    const deletingList = useSelector(state => selectModalByName(state, "deletingList"))

    const recipesStatus = useSelector(selectRecipesStatus)
    const filterStatus = useSelector(selectFilterStatus)
    const listStatus = useSelector(selectListsStatus)
    const focusedRecipeObj = useSelector(selectFocusedRecipeObj)
    const focusedListName = useSelector(selectFocusedListName)
    const focusedUserId = useSelector(selectFocusedUser)
    const focusedUser = useSelector(selectFocusedUser)


    const recipeIds = useSelector(selectRecipeIds)

    const [ newListName, setNewListName ] = useState("")
    
    
    useEffect(() => {
        if(filterStatus !== "filtered" || recipesStatus === 'succeeded' || listStatus !== "filtered" || focusedUserId){
            debouncedFilter(fetchFilteredRecipes());
        }
    },[dispatch,listStatus,filterStatus,recipesStatus,focusedUserId,debouncedFilter])

    const handleCreateList = () => {
        dispatch(addList({name:newListName}))
        dispatch(setModal({creatingList:false}))
        setNewListName("")
    }
    const handleDeleteList = () => {
        batch(()=>{
            dispatch(setModal({deletingList:false}))
            dispatch(deleteList())
        })
        
    }
    const handleDeleteRecipe = () => {
        batch(()=>{
            dispatch(setModal({deletingRecipe:false}))
            dispatch(deleteRecipe())
        })
        
    }


    return (
        <div>
            <Paper 
            className="recipe-book-container"
            id="recipe-book-container"
            elevation={12} 
            style={{
                width: "80vw",
                height: "85vh",
                margin: "auto",
                transform: "translate(0,5%)",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{display:"flex", justifyContent:"space-around"}}>
                    <div className="filter-container" style={{display:"flex", justifyContent:"space-around", width:"30rem"}}>
                        <RecipeSearch/>
                        <Popover content={<Filter/>} placement="rightTop" trigger="click"><IconButton style={{margin:"auto"}}><FilterOutlined/></IconButton></Popover>  
                    </div>
                    <Typography style={{margin:"auto"}}>{focusedUser[0] ? `${focusedUser[0].username}'s Recipes`:focusedListName}</Typography>
                    <div style={{margin:"auto 2rem auto auto", right:"0", display:"flex", justifySelf:"right"}} className="new-recipe-button-container">
                        <Button 
                            onClick={()=>{
                                dispatch(setFocusedRecipe(""))
                                dispatch(setModal({creatingRecipe: true}));
                                }}
                        >
                            <PlusOutlined/>New Recipe
                        </Button>
                    </div>
                </div>
                <Divider/>
                <div style={{display:"flex", flexFlow:"wrap", overflow:"auto", justifyContent:"flex-start"}}>
                    {Array.from(Object.values(recipeIds)).map(recipeId => {
                        //sets popover content
                        return(<RecipeCard recipeId={recipeId} key={recipeId}/>)
                    })}
                </div>
            </Paper>
            <Modal open={creatingRecipe} onCancel={()=>{dispatch(setModal({creatingRecipe:false}));}} footer={null} style={{minWidth:"80vw"}}>
                <NewRecipe/>
            </Modal>
            <Modal open={editingRecipe} onCancel={()=>{dispatch(setModal({editingRecipe:false}));}} footer={null} style={{minWidth:"80vw"}}>
                <NewRecipe/>
            </Modal>
            <Modal open={deletingRecipe} onCancel={()=>{dispatch(setModal({deletingRecipe:false}));}} title="Delete Recipe?" okText="Delete" cancelText="Cancel" onOk={()=>{handleDeleteRecipe()}}>
                <p>Are you sure you want to delete {focusedRecipeObj ? focusedRecipeObj.name: null}?</p>
            </Modal>
            <Modal open={viewingRecipe} onCancel={()=>{dispatch(setModal({viewingRecipe:false}))}} footer={null} style={{minWidth:"80vw"}}>
                <RecipeView/>
            </Modal>
            <Modal open={creatingList} onCancel={()=>{dispatch(setModal({creatingList:false}))}} title="New List" okText={"Create"} onOk={()=>handleCreateList()}>
                <Input placeholder="List Name" value={newListName} onChange={(e)=>setNewListName(e.target.value)}/>
            </Modal>
            <Modal open={deletingList} onCancel={()=>{dispatch(setModal({deletingList:false}))}} title="Delete List" okText="Delete" onOk={()=>handleDeleteList()}>
                <p>Are you sure you want to delete {focusedListName}?</p>
            </Modal>
        </div>
    );
}

export default Recipes;