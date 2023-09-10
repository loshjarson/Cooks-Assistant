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
import { ShoppingCartOutlined } from '@mui/icons-material';




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
        } if(history.location.pathname !== "/home"){
            history.push("/home")
            history.go("/home")
        }
    }

    const handleGoToGroceries = () => {
        if(history.location !== "home"){
            history.push("/groceries")
            history.go("/groceries")
        }
    }
    
    const sidebarWidth = window.screen.width > 767 ? "15vw" : "60vw"

    return ( 
        <Drawer 
        variant='permanent'
        anchor="right"
        id='sidebar'
        color='primary'
        sx={{
            overflowY:"hidden",
            [`& .MuiDrawer-paper`]: {width:sidebarOpen ? sidebarWidth: "0"},
        }}
        >
            <div id="sidebar-head">
                <Button
                    className='sidebar-button'
                    onClick={()=>handleGoToGroceries()}
                    startIcon={<ShoppingCartOutlined/>}
                    style={{color:"black"}}
                >
                    My Grocery List
                </Button>
                <Divider/>
                <Button
                    className='sidebar-button'
                    onClick={()=>handleReturnHome()}
                    startIcon={<HomeOutlined/>}
                    style={{color:"black"}}
                >
                    My Recipes
                </Button>
                
                <Button
                    className='sidebar-button'
                    onClick={()=>{dispatch(setFocusedRecipe(""));dispatch(setModal({creatingList:true}))}}
                    startIcon={<PlusOutlined/>}
                    style={{color:"black"}}
                >
                    New List
                </Button>
                <Divider/>
                
            </div>
            <div id='list-card-container' style={{
                overflowY:"scroll",
                height:"inherit",
                }}>
                    {Object.values(lists).map(list => 
                        (<ListCard list={list} key={list._id}/>)
                    )}
            </div>
            <div 
            id='account-actions'
            >
                <Divider/>
                <Button icon={<LogoutOutlined/>} type="text" style={{width:"100%",color:"black"}} onClick={() => dispatch(setModal({loggingOut:true}))}>Logout</Button>
                <Modal open={loggingOut} onCancel={()=>dispatch(setModal({loggingOut: false}))} title="Logout?" okText="Logout" cancelText="Nevermind" onOk={()=>logout()}><p>Are you sure you want to logout</p></Modal>
            </div>
        </Drawer> 
    );
}

export default SideBar;