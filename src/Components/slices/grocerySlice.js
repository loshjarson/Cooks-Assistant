import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import convert from 'convert-units';
import axios from "axios";
const GROCERIES_URL = 'https://cooksassistant-4e729736581a.herokuapp.com/grocerylists/'

const initialState = {
    recipes:{},
    ingredients:{},
    error:null,
    status:"idle"
}

export const fetchGroceries = createAsyncThunk('groceries/fetchGroceries', async ()=>{
    return axios.get(GROCERIES_URL,{headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
            return err.message
        })
})

export const editGroceries = createAsyncThunk('groceries/editGroceries', async (none, {getState})=>{
    const {groceries} = getState()
    if(Object.keys(groceries.recipes)>0){
        const data = Object.keys(groceries.recipes).map(recipe => {
            return {
                recipe,
                quantity: groceries.recipes[recipe]
            }
        })
        const recipes = JSON.stringify(data)
        return axios({
            method:"put",
            url:GROCERIES_URL + "update",
            data:{recipes},
            headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}
            })
            .then(res => {
                return res.data
            })
            .catch(err => {
                console.log(err)
                return err.message
            })
    }
})

export const calculateGroceries = createAsyncThunk('groceries/calculate', async (none,{getState,dispatch}) => {
    const {recipes, groceries} = getState()
    const groceryList = {};
    Object.keys(groceries.recipes).forEach(recipe => {
        const quantity = groceries.recipes[recipe];
        if(quantity > 0){
           recipes.recipes[recipe].ingredients.forEach(ingredient => {
            const name = ingredient.name.toLowerCase().replaceAll(" ","#");
            if(ingredient.unit.length > 0){
                let amount = convert(ingredient.amount*quantity).from(ingredient.unit).to('cup');
                if(groceryList[name]){
                    groceryList[name].amount += amount
                } else {
                    groceryList[name] = {amount}
                }
            } else {
                const overflow = ingredient.amount*quantity
                if(groceryList[name]){
                    groceryList[name].overflow += overflow
                    } else {
                        groceryList[name] = {overflow}
                    }
            }
        }) 
        }
        
    })
    Object.keys(groceryList).forEach(ingredient => {
        if(groceryList[ingredient].amount){
            groceryList[ingredient].amount = convert(groceryList[ingredient].amount).from("cup").toBest({system:"imperial", exclude:["in3"],cutOffNumber:3});
        }
    })
    return groceryList

})

const groceries = createSlice({
    name:"groceries",
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload
        },
        increaseQuantity: (state,action) => {
            state.recipes[action.payload] = state.recipes[action.payload] + 1
        },
        decreaseQuantity: (state,action) => {
            if(state.recipes[action.payload]>0){
                state.recipes[action.payload] = state.recipes[action.payload] - 1
            }
            
        }
    },
    extraReducers(builder) {
        builder

            .addCase(fetchGroceries.fulfilled, (state,action) => {
                if(action.payload.code !== "ERR_NETWORK" && action.payload.code !== "ERR_BAD_RESPONSE"){
                   action.payload.groceries.forEach(recipe => {
                    state.recipes[recipe.recipe] = recipe.quantity
                    })
                    state.status = "fetched" 
                }else {
                    state.status = "failed"
                    state.error = action.payload
                }
                
            })
            .addCase(fetchGroceries.rejected, (state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(editGroceries.fulfilled, (state,action)=>{
                state.status = "fetched"
                state.recipes = {}
                action.payload.groceries.forEach(recipe => {
                    state.recipes[recipe.recipe] = recipe.quantity
                })
            })
            .addCase(editGroceries.rejected, (state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(calculateGroceries.fulfilled, (state,action)=>{
                state.status = "calculated"
                state.ingredients = {...action.payload}
                
            })
            .addCase(calculateGroceries.rejected, (state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
            
    }
})

export const selectIngredients = (state) => state.groceries.ingredients
export const selectGroceriesStatus = (state) => state.groceries.status
export const selectRecipeQuantities = (state) => state.groceries.recipes
export const selectQuantityByRecipe = (state,action) => state.groceries.recipes[action.payload]

export const {increaseQuantity, decreaseQuantity} = groceries.actions


export default groceries.reducer