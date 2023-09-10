import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    name: "",
    filterableIngredients: [],
    filterableTags: [],
    selectedIngredients:[],
    selectedTags: [],
    prepTime: [0,Infinity],
    cookTime: [0,Infinity],
    totalTime: [0,Infinity],
    status: "idle",
    sortOption: "name",
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.status = "updated"
            const [field,value] = Object.entries(action.payload)[0]
            state[field] = value
            
        },
        setFilterAndStatus: (state,action) => {
            return {...state, ...action.payload, status:"filtered"}
        },
        setFilterableTags: (state, action) => {
            state.filterableTags = [...action.payload];
            state.status = "updated"
        },
        setFilterableIngredients: (state, action) => {
            state.filterableIngredients = [...action.payload];
            state.status = "updated"
        },
        setSelectedTags: (state, action) => {
            state.selectedTags = [...action.payload];
            state.status = "updated"
        },
        setSelectedIngredients: (state, action) => {
            state.selectedIngredients = [...action.payload];
            state.status = "updated"
        },
        setFilteredStatus: (state) => {
            state.status = "filtered"
        }
    }
})

export const selectFullFilter = (state) => state.persistedReducer.filter
export const selectFilterableTags = (state) => state.persistedReducer.filter.filterableTags
export const selectFilterableIngredients = (state) => state.persistedReducer.filter.filterableIngredients
export const selectSelectedTags = (state) => state.persistedReducer.filter.selectedTags
export const selectSelectedIngredients = (state) => state.persistedReducer.filter.selectedIngredients
export const selectFilterStatus = (state) => state.persistedReducer.filter.status

export const {
    setFilterableTags,
    setFilterableIngredients,
    setSelectedTags,
    setSelectedIngredients,
    setFilter,
    setFilteredStatus,
    setFilterAndStatus
  } = filterSlice.actions;

export default filterSlice.reducer

//keeps track of filter values