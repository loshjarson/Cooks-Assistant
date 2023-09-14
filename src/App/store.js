import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage  from "redux-persist/lib/storage";
import thunk from "redux-thunk"

import filterReducer from "../Components/slices/filterSlice"; 
import recipesReducer from "../Components/slices/recipesSlice";
import listsReducer from "../Components/slices/listsSlice";
import modalsReducer from "../Components/slices/modalsSlice";
import draggableReducer from "../Components/slices/draggableSlice";
import authenticatedReducer from "../Components/slices/authenticatedSlice";
import usersReducer from "../Components/slices/usersSlice";
import groceriesReducer from "../Components/slices/grocerySlice"
import colorReducer from "../Components/slices/colorSlice";


const reducers = combineReducers({
    filter: filterReducer,
    recipes: recipesReducer,
    lists: listsReducer,
    modals: modalsReducer,
    draggable: draggableReducer,
    authenticated: authenticatedReducer,
    users: usersReducer,
    groceries: groceriesReducer,
    color: colorReducer
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['filter','recipes','modals','groceries', 'users'],
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: {
        persistedReducer,   
    },
    middleware:[thunk]
})