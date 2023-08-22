import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "../../App/history";
import axios from "axios";

const initialState = {
    authenticated: false,
    status: 'idle',
    error: null
}

export const fetchAuthenticated = createAsyncThunk('authenticated/fetchAuthenticated', () => {
    if(!sessionStorage.getItem("token")){
        history.push("/")
        history.go("/")
    } else {
        axios({
            method:"post",
            url:"http://localhost:8000/auth/authenticate",
            headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
        }).then(res => {
            return(Boolean(res.status === 200))
        })
        .catch(function(e){
            if(e.response.status === 403){
                history.push("/")
                history.go("/")
                return false
            }
        })
        
    }
})

const authenticatedSlice = createSlice({
    name:"authenticated",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAuthenticated.pending, (state) => {
                state.status = 'pending';
            } )
            .addCase(fetchAuthenticated.fulfilled, (state) => {
                state.status = 'succeeded';
                state.authenticated = true;
            })
            .addCase(fetchAuthenticated.rejected, (state) => {
                state.status = "failed"
                state.authenticated = false
            })

    }
})

export const selectAuthenticated = (state) => state.authenticated.authenticated

export default authenticatedSlice.reducer