import React from 'react';

import { Button, Divider, Drawer } from '@mui/material';
import { HomeOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import history from '../App/history';

import { useDispatch, useSelector } from 'react-redux';
import { selectModalByName, setModal } from './slices/modalsSlice';
import {  selectAllLists, setFocusedList } from './slices/listsSlice';
import { selectFocusedUserId, setFocusedUser } from './slices/usersSlice';
import { fetchRecipes, setFocusedRecipe } from './slices/recipesSlice';
import ListCard from './ListCard';




function SideBar() {

    const dispatch = useDispatch()
    const sidebarOpen = useSelector(state => selectModalByName(state,"sidebarOpen"))
    const loggingOut = useSelector(state => selectModalByName(state,"loggingOut"))
    const lists = useSelector(selectAllLists)
    const focusedUser = useSelector(selectFocusedUserId)


    const logout = () => {
        sessionStorage.clear()
        history.push("/")
        history.go("/")
    }

    const handleReturnHome = () => {
        dispatch(setFocusedList(""))
        if(focusedUser){
                dispatch(setFocusedUser(null))
                dispatch(fetchRecipes()) 
        }
    }
    
    return ( 
        <Drawer 
        variant='permanent'
        anchor="right"
        sx={{
            margin: "auto",
            [`& .MuiDrawer-paper`]: {top:"auto", width:sidebarOpen ? "15vw": "0", transition:"width 300ms ease-in-out 100ms", zIndex:"500"},
        }}
        >
            <div>
                <Button
                    className='list'
                    style={{width:"100%", height:"4rem"}}
                    onClick={()=>handleReturnHome()}
                    startIcon={<HomeOutlined/>}
                >
                    My Recipes
                </Button>
                <Button
                    className='list'
                    style={{width:"100%", height:"4rem"}}
                    onClick={()=>{dispatch(setFocusedRecipe(""));dispatch(setModal({creatingList:true}))}}
                    startIcon={<PlusOutlined/>}
                >
                    New List
                </Button>
                <Divider/>
                
                {Object.values(lists).map(list => 
                    (<ListCard list={list} key={list.name}/>)
                )}
            </div>
            <div 
            id='account-actions'
            style={{margin:"auto 0 4rem 0"}}
            >
                <Divider/>
                <Button icon={<LogoutOutlined/>} type="text" style={{width:"100%"}} onClick={() => dispatch(setModal({loggingOut:true}))}>Logout</Button>
                <Modal open={loggingOut} onCancel={()=>dispatch(setModal({loggingOut: false}))} title="Logout?" okText="Logout" cancelText="Nevermind" onOk={()=>logout()}><p>Are you sure you want to logout</p></Modal>
            </div>
        </Drawer> 
    );
}

export default SideBar;