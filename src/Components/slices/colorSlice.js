import { createSlice } from "@reduxjs/toolkit";

const initialState = 0

const colorSlice = createSlice({
    name: 'color',
    initialState,
    reducers: {
        cycleStep: (state) => {
            if (state === 2){
                return 0
            } else {
                return state+1
            }
        }
    }
})

export const selectCycle = (state) => state.persistedReducer.color

export const {cycleStep} = colorSlice.actions

export default colorSlice.reducer