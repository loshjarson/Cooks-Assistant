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
import { deleteRecipe, fetchFilteredRecipes, fetchRecipes, selectFocusedRecipeObj, selectRecipeIds, selectRecipesStatus, setFocusedRecipe, setRecipeStatus } from "./slices/recipesSlice";
import { selectFilterStatus } from "./slices/filterSlice";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { addList, fetchLists, selectFocusedListName, selectListsStatus } from "./slices/listsSlice";



function Recipes() {

    const dispatch = useDispatch()

    const creatingRecipe = useSelector(state =>selectModalByName(state,"creatingRecipe"))
    const editingRecipe = useSelector(state =>selectModalByName(state,"editingRecipe"))
    const deletingRecipe = useSelector(state =>selectModalByName(state,"deletingRecipe"))
    const viewingRecipe = useSelector(state => selectModalByName(state, "viewingRecipe"))
    const creatingList = useSelector(state => selectModalByName(state, "creatingList"))

    const recipesStatus = useSelector(selectRecipesStatus)
    const filterStatus = useSelector(selectFilterStatus)
    const listStatus = useSelector(selectListsStatus)
    const focusedRecipeObj = useSelector(selectFocusedRecipeObj)
    const focusedListName = useSelector(selectFocusedListName)

    const recipeIds = useSelector(selectRecipeIds)

    const [ newListName, setNewListName ] = useState("")

    useEffect(()=>{
        if(recipesStatus === 'idle') {
            dispatch(setRecipeStatus())
            batch(()=>{
                dispatch(fetchRecipes())
                dispatch(fetchLists())
                
            })
        }
    },[recipesStatus,dispatch])
    
    

    useEffect(() => {
        if(filterStatus !== "filtered" || recipesStatus === 'succeeded' || listStatus !== "filtered"){
            dispatch(fetchFilteredRecipes());
        }
    },[dispatch,listStatus,filterStatus,recipesStatus])

    const handleCreateList = () => {
        dispatch(addList({name:newListName}))
        dispatch(setModal({creatingList:false}))
        setNewListName("")
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
                    <Typography style={{margin:"auto"}}>{focusedListName}</Typography>
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
                <div style={{display:"flex", flexFlow:"wrap", overflow:"scroll", justifyContent:"flex-start"}}>
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
            <Modal open={deletingRecipe} onCancel={()=>{dispatch(setModal({deletingRecipe:false}));}} title="Delete Recipe?" okText="Delete" cancelText="Cancel" onOk={()=>dispatch(deleteRecipe())}>
                <p>Are you sure you want to delete {focusedRecipeObj ? focusedRecipeObj.name: null}?</p>
            </Modal>
            <Modal open={viewingRecipe} onCancel={()=>{dispatch(setModal({viewingRecipe:false}))}} footer={null} style={{minWidth:"80vw"}}>
                <RecipeView/>
            </Modal>
            <Modal open={creatingList} onCancel={()=>{dispatch(setModal({creatingList:false}))}} title="New List" okText={"Create"} onOk={()=>handleCreateList()}>
                <Input placeholder="List Name" value={newListName} onChange={(e)=>setNewListName(e.target.value)}/>
            </Modal>
        </div>
    );
}

export default Recipes;