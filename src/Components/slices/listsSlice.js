import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const LISTS_URL = 'http://localhost:8000/recipelists/'

const initialState = {
    focused:"",
    lists:{},
    status:'idle',
    error: null,
}

export const fetchLists = createAsyncThunk('lists/fetchLists', async () => {
    const userId = sessionStorage.getItem("userId")
    return axios.get(LISTS_URL+userId, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                return(res.data)
            })
            .catch(err => {
                return err.message
            })
})

export const addList = createAsyncThunk('lists/addList', async (list,{getState}) => {
    const {recipes} = getState()
    if (recipes.focused) list.recipes = JSON.stringify(recipes.focused);
    return axios({
        method: "post",
        url: LISTS_URL,
        data: list,
        headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
    }).then(res => {
        return res.data
    }).catch(err => {
        return err.message
    })

    
    
})

export const editList = createAsyncThunk('lists/addToList', async (action, {getState}) => {
    const {lists} = getState()
    const [recipe, list] = action
    const editingList = lists.lists[list]

    const updatedList = {...editingList,recipes:JSON.stringify([...editingList.recipes,recipe])}

    return axios({
        method:"put",
        url: LISTS_URL+list,
        data: updatedList,
        headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
    }).then(res => {
        return res.data
    }).catch(err => {
        return err.message
    })
})

export const deleteList = createAsyncThunk('lists/deleteList', async (listId) => {
    return axios({
        method:"delete",
        url: LISTS_URL+listId,
        headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
    }).then(res => {
        return listId
    }).catch(err => {
        return err.message
    })
})

const listsSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        addList: () => {
        },
        resetList: () => {},
        setFocusedList: (state,action) => {state.focused = action.payload; state.status = "succeeded"},
        setListsStatus:(state,action)=> {state.status = action.payload}
    },
    extraReducers(builder) {
        builder
            //cases for fetchLists request
            .addCase(fetchLists.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const loadedLists = action.payload
                const listMap = {}
                //create map of lists with list ids as keys
                loadedLists.forEach((list) => {
                    listMap[list._id] = {...list};
                });
                state.lists = listMap
            })
            .addCase(fetchLists.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            
            //cases for addList request
            .addCase(addList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const newList = action.payload
                //add new list to lists state map
                state.lists[newList._id] = newList
            })
            .addCase(addList.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            //cases for editList request
            .addCase(editList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const updatedList = action.payload
                //add updated list to lists state map
                state.lists[updatedList._id] = updatedList
            })
            .addCase(editList.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            //cases for deleteList request
            .addCase(deleteList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const deletedList = action.payload
                state.focused = ""
                //delete list from state map
                delete state.lists[deletedList]
            })
            .addCase(deleteList.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const selectAllLists = (state) => state.lists.lists;
export const selectFocusedList = (state) => state.lists.focused;
export const selectListById = (state,action) => state.lists.lists[action.payload];
export const selectListsStatus = (state) => state.lists.status;
export const selectListsError = (state) => state.lists.error;
export const selectFocusedListName = (state) => state.lists.focused ? state.lists.lists[state.lists.focused].name : "My Recipes"
export const selectFocusedListRecipes = (state) => state.lists.lists[state.focused].recipes

export const { setFocusedList, setListsStatus } = listsSlice.actions

export default listsSlice.reducer