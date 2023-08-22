import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { Buffer } from "buffer";

import { recipeToFormData, matchesRangeFilter, matchesNameFilter } from "../helpers/helpers";
import { setFilterAndStatus } from "./filterSlice";
import { fetchLists, setListsStatus } from "./listsSlice";
import { batch } from "react-redux";

const RECIPES_URL = 'http://localhost:8000/recipes/'

const initialState = {
    focused:"",
    recipes:{},
    filtered:{},
    status:'idle',
    error: null,
}

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async (l,{dispatch}) => {
    const userId = sessionStorage.getItem("userId")
    return axios.get(RECIPES_URL+userId, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                const recipes = res.data
                //replace node.js Buffer object with object url pointing to blob
                recipes.forEach((recipe,i)=>{
                    if(recipe.image){
                        const buffer = Buffer.from(recipe.image.data)
                        const blob = new Blob([buffer], {type:"image/jpeg"})
                        recipe.image = window.URL.createObjectURL(blob)
                    }
                })
                return(recipes)
            })
            .catch(err => {
                console.log(err)
                return err.message
            })
})

export const addRecipe = createAsyncThunk('recipes/addRecipe', async (recipe,{dispatch}) => {
    const recipeFormData = recipeToFormData(recipe)

    return axios({
        method:"post",
        url:RECIPES_URL,
        data: recipeFormData,
        headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`, 'Content-Type':'multipart/form-data'},
    }).then(res => {
            let recipe = res.data

            //replace node.js Buffer object with object url pointing to blob
            if(recipe.image){
                const buffer = Buffer.from(recipe.image.data)
                const blob = new Blob([buffer], {type:"image/jpeg"})
                recipe.image = window.URL.createObjectURL(blob)
            }
            dispatch(setFocusedRecipe(recipe._id))
            return recipe
        })
        .catch(err=>{
            console.log(err)
        })
})

export const editRecipe  = createAsyncThunk('recipes/editRecipe', async (action,dispatch) => {
    const [recipeId, edits] = action
    const recipeFormData = recipeToFormData(edits)
    return axios({
        method:"put",
        url:RECIPES_URL+recipeId,
        data: recipeFormData,
        headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`, 'Content-Type':'multipart/form-data'},
    }).then(res => {
            let recipe = res.data
            
            //replace node.js Buffer object with object url pointing to blob
            if(recipe.image){
                const buffer = Buffer.from(recipe.image.data)
                const blob = new Blob([buffer], {type:"image/jpeg"})
                recipe.image = window.URL.createObjectURL(blob)
                console.log(recipe.image)
            }

            return recipe
        })
        .catch(err=>{
            return err.message
        })
})

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', async (_,{getState,dispatch}) => {
        const { recipes } = getState()
        const recipeId = recipes.focused
        return axios({
            method:"delete",
            url:RECIPES_URL+recipeId,
            headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
        }).then(res => {
            const deletedRecipe = res.data.recipe
            dispatch(fetchLists)
            return deletedRecipe
        })
        .catch(err => {
            return err.message
        })
})

export const fetchFilteredRecipes = createAsyncThunk('recipes/fetchFilteredRecipes', (_, { getState, dispatch }) => {
    const { recipes, filter, lists } = getState();
    const { focused, lists: listData } = lists;
    const { recipes: recipeData } = recipes;
  
    const recipesToFilter = focused ? listData[focused].recipes : Object.keys(recipeData);
  
    const selectedTagsArray = filter.selectedTags;
    const selectedIngredientsArray = filter.selectedIngredients;
  
    const filterableTags = new Set();
    const filterableIngredients = new Set();
  
    let filteredList = recipesToFilter.filter((recipeId) => {
      const recipe = recipeData[recipeId];
      
      let matchesFilter = true;
      const recipeTagsSet = new Set(recipe.tags);
      const recipeIngredientsSet = new Set(recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase()));
  
      matchesFilter = matchesNameFilter(filter.name, recipe.name);
      if (!matchesFilter) return false;
  
      matchesFilter = matchesRangeFilter(filter.prepTime, recipe.prepTime);
      if (!matchesFilter) return false;
  
      matchesFilter = matchesRangeFilter(filter.cookTime, recipe.cookTime);
      if (!matchesFilter) return false;
  
      matchesFilter = matchesRangeFilter(filter.totalTime, recipe.totalTime);
      if (!matchesFilter) return false;
  
      recipeTagsSet.forEach((tag) => filterableTags.add(tag));
      recipeIngredientsSet.forEach((ingredient) => filterableIngredients.add(ingredient));
  
      return true;
    });
  
    const updatedSelectedTags = new Set(selectedTagsArray.filter((tag) => filterableTags.has(tag)));
  
    const updatedSelectedIngredients = new Set(
      selectedIngredientsArray.filter((ingredient) => filterableIngredients.has(ingredient))
    );
  
    if (updatedSelectedTags.size > 0 || updatedSelectedIngredients.size > 0) {
      filterableIngredients.clear();
      filterableTags.clear();
      filteredList = filteredList.filter((recipeId) => {
        const recipe = recipeData[recipeId];
        const recipeTagsSet = new Set(recipe.tags);
        const recipeIngredientsSet = new Set(recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase()));
        
        const tagsMatch = updatedSelectedTags.size === 0 || [...updatedSelectedTags].every((tag) => recipeTagsSet.has(tag));
        const ingredientsMatch = updatedSelectedIngredients.size === 0 || [...updatedSelectedIngredients].every((ingredient) => recipeIngredientsSet.has(ingredient));
        
        if (tagsMatch && ingredientsMatch) {
          recipeTagsSet.forEach((tag) => filterableTags.add(tag));
          recipeIngredientsSet.forEach((ingredient) => filterableIngredients.add(ingredient));
        }
        
        return tagsMatch && ingredientsMatch;
      });
    }
  
    batch(() => {
      dispatch(
        setFilterAndStatus({
          filterableIngredients: Array.from(filterableIngredients),
          filterableTags: Array.from(filterableTags),
          selectedIngredients: Array.from(updatedSelectedIngredients),
          selectedTags: Array.from(updatedSelectedTags),
        })
      );
      dispatch(setListsStatus("filtered"));
    });
  
    return filteredList;
  });

const recipesSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {
        resetRecipes: (state) => {
            state = {
                ...initialState, 
                recipes:{},
                filtered:{}
            }
        },
        setFocusedRecipe: (state, action) => {return {...state, focused:action.payload}},
        setRecipeStatus: (state) => {state.status = "fetching"}
    },
    extraReducers(builder) {
        builder

            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const loadedRecipes = action.payload
                const recipeMap = {}
                //map recipes with recipe ids as keys
                loadedRecipes.forEach((recipe) => {
                    recipeMap[recipe._id]= {...recipe};
                });
                state.recipes = recipeMap
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(addRecipe.fulfilled, (state,action) => {
                state.status = 'succeeded'
                const newRecipe = action.payload
                state.recipes[newRecipe._id] = action.payload
                state.focused = newRecipe._id
            })
            .addCase(addRecipe.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(editRecipe.fulfilled, (state,action) => {
                state.status = 'succeeded'
                const editedRecipe = action.payload
                state.recipes[editedRecipe._id] = editedRecipe
                state.filtered[editedRecipe._id] = editedRecipe
                state.focused = editedRecipe._id
            })
            .addCase(editRecipe.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(deleteRecipe.fulfilled, (state,action) => {
                state.status = 'succeeded'
                const deletedRecipe = action.payload
                delete state.recipes[deletedRecipe._id]
                state.focused = ""
            })
            .addCase(deleteRecipe.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            //cases for fetchFilteredList
            .addCase(fetchFilteredRecipes.fulfilled, (state,action) => {
                Object.keys(state.recipes).forEach((recipeId)=> {
                    if(action.payload.includes(recipeId)){
                        state.filtered[recipeId] = state.recipes[recipeId]
                    } else {
                        state.filtered[recipeId] = null
                    }
                })
                state.status = "filtered"
            })
            //cases for fetchFilteredList
            .addCase(fetchFilteredRecipes.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const selectAllRecipes = (state) => state.recipes.recipes;
export const selectFilteredRecipes = (state) => state.recipes.filtered;
export const selectRecipeById = (state,action) => state.recipes.recipes[action];
export const selectRecipesStatus = (state) => state.recipes.status;
export const selectRecipesError = (state) => state.recipes.error;
export const selectFocusedRecipe = (state) => state.recipes.focused;
export const selectFocusedRecipeObj = (state) => state.recipes.recipes[state.recipes.focused];
export const selectRecipeIds = createSelector(
    [state=>state.recipes.recipes], recipes => Object.keys(recipes)
)
export const selectFilteredRecipeById = createSelector(
    [selectFilteredRecipes, (state,recipeId)=>recipeId],
    (recipes, recipeId) => recipes[recipeId]
)

// (state,action)=>state.recipes.filtered[action]


export const {setFocusedRecipe,setRecipeStatus} = recipesSlice.actions

export default recipesSlice.reducer