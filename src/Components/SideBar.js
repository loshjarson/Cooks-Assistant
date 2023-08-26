import React, { useState } from 'react';

import { Button, Divider, Drawer } from '@mui/material';
import { LogoutOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import history from '../App/history';

import { batch, useDispatch, useSelector } from 'react-redux';
import { selectDragging } from './slices/draggableSlice';
import { selectModalByName, setModal } from './slices/modalsSlice';
import { editList, selectAllLists, setFocusedList } from './slices/listsSlice';
import { selectFocusedUserId, setFocusedUser, setUserStatus } from './slices/usersSlice';
import { fetchRecipes } from './slices/recipesSlice';




function SideBar() {

    const dispatch = useDispatch()
    const dragging = useSelector(selectDragging)
    const sidebarOpen = useSelector(state => selectModalByName(state,"sidebarOpen"))
    const loggingOut = useSelector(state => selectModalByName(state,"loggingOut"))
    const lists = useSelector(selectAllLists)
    const [ hovering, setHovering ] = useState("")
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

    const handleList = (list) => {
        dispatch(setFocusedList(list._id))
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
                >
                    My Recipes
                </Button>
                {Object.values(lists).map(list => {
                    return(
                        <Button
                            key={list._id}
                            id={list._id}
                            className='list'
                            style={{width:"100%", height:"4rem"}}
                            color={list._id === hovering ? "secondary" : "primary"}
                            variant={list._id === hovering ? "outlined" : "text"}
                            onClick={()=>handleList(list)}
                            onDragOver={(e)=>{e.preventDefault(); setHovering(list._id)}}
                            onDragLeave={(e)=>{e.preventDefault(); setHovering("")}}
                            onDrop={(e)=>{e.preventDefault(); dispatch(editList([dragging,hovering])); setHovering("")}}
                        >
                            {list.name}
                        </Button>
                    )
                })}

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