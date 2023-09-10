import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dragging: "",
    hovering: ""
}

const draggableSlice = createSlice({
    name:'draggable',
    initialState,
    reducers: {
        setDragging : (state,action) => {
            state.dragging = action.payload
        },
        setHovering : (state,action) => {
            state.hovering = action.payload
        }
    }
})

export const selectDragging = (state) => state.persistedReducer.draggable.dragging
export const selectHovering = (state) => state.persistedReducer.draggable.hovering
export const { setDragging, setHovering } = draggableSlice.actions

export default draggableSlice.reducer

//used to handle drag and drop feature of recipes