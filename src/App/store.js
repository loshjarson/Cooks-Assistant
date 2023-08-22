import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../Components/slices/filterSlice"; 
import recipesReducer from "../Components/slices/recipesSlice";
import listsReducer from "../Components/slices/listsSlice";
import modalsReducer from "../Components/slices/modalsSlice"
import draggableReducer from "../Components/slices/draggableSlice"
import authenticatedReducer from "../Components/slices/authenticatedSlice";

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        recipes: recipesReducer,
        lists: listsReducer,
        modals: modalsReducer,
        draggable: draggableReducer,
        authenticated: authenticatedReducer
    }
})