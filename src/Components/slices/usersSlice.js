import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const USERS_URL = "https://cooksassistant-4e729736581a.herokuapp.com/users/"

const initialState = {
    focused: null,
    users:[],
    error:"",
    status:"home"
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return axios.get(USERS_URL, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
    .then(res => {
        return res.data.filter(user => user._id !== sessionStorage.getItem("userId"))
    })
    .catch(err => {
        console.log(err)
        return err.message
    })
})

export const fetchRecipesByUser = createAsyncThunk('users/fetchRecipesByUser', async (username) => {
    return axios.get(USERS_URL+username, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
            return err.message
        })
})

const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{
        setFocusedUser: (state,action) => {
            state.focused = action.payload
            state.status = action.payload ? "visiting" : "home"
        },
        setUserStatus: (state) => {
            state.status = "home"
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state,action)=>{
                state.users = [...action.payload]
            })
            .addCase(fetchUsers.rejected, (state,action) => {
                state.error = action.payload
            })
    }
})

export const selectFocusedUserId = (state) => state.persistedReducer.users.focused
export const selectUserStatus = (state) => state.persistedReducer.users.status
export const selectAllUsers = (state) => state.persistedReducer.users.users
export const selectFocusedUser = createSelector([selectFocusedUserId, state => state.persistedReducer.users.users], (userId,users) => users.filter(user => user._id === userId))
export const selectUsernameIdPairs = createSelector(
    [selectAllUsers], 
    users => users.map((user) => { return {label: user.username, value: user._id} })
)
// export const selectUserRecipes

export const {setFocusedUser,setUserStatus} = usersSlice.actions

export default usersSlice.reducer
