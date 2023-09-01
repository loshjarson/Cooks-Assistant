import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    creatingRecipe: false,
    editingRecipe: false,
    deletingRecipe: false,
    viewingRecipe: false,
    creatingList: false,
    editingList: false,
    deletingList: false,
    loggingOut: false,
    sidebarOpen: false,
    viewingGroceryRecipes: false    
}

const modalsSlice = createSlice({
    name:'modals',
    initialState,
    reducers: {
        setModal: (state,action) => {
            return {...state,...action.payload}
        }

    }
})

export const selectAllModals = (state) => state.modals
export const selectModalByName = (state,action) => state.modals[action]
export const selectIsModalOpen = (state) => Object.values(state.modals).includes(true)

export const {setModal} = modalsSlice.actions

export default modalsSlice.reducer