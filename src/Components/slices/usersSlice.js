import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const USERS_URL = "http://localhost:8000/users/"

const initialState = {
    focusedUser: null,
    users:[]
};

export const fetchUsers = createAsyncThunk('recipes/fetchUsers', async (username) => {
    return axios.get(USERS_URL+username, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
})

const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{
        setFocusedUser: (state,action) => {
            state.focusedUser = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state,action)=>{
                state.users.push(action.payload)
            })
    }
})

export const {setFocusedUser} = usersSlice.actions

export default usersSlice.reducer
