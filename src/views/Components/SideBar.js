import React, { useState } from 'react';
import { Button, Divider, Drawer } from '@mui/material';
import { LogoutOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import history from '../../history';
import axios from "axios";




function SideBar({open, lists, setLists, setFocusedList, filterRecipes, dragging, setDragging, filterValues, setFilterValues}) {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [hovered, setHovered] = useState("")

    const logout = () => {
        sessionStorage.clear()
        history.push("/")
        history.go("/")
        setShowConfirmation(false)
    }

    const addToList = (recipeId,list) => {
        console.log(list)
        axios.put(
            `http://localhost:8000/recipelists/${list._id}`,
            {recipes:JSON.stringify([...list.recipes, recipeId])},
            {
                headers: {
                    'authorization': `bearer ${sessionStorage.getItem("token")}`,
                },
            })
        .then(res => {
            console.log(res)
            const updatedLists = lists.filter(l => l._id !== res.data.updatedList._id);
            updatedLists.push(res.data.updatedList)
            setLists(updatedLists)
            setDragging("")
        })
    }
    
    return ( 
        <Drawer 
        variant='permanent'
        anchor="right"
        sx={{
            margin: "auto",
            [`& .MuiDrawer-paper`]: {top:"auto", width:open ? "15vw": "0", transition:"width 300ms ease-in-out 100ms", zIndex:"500"},
        }}
        >
            <div>
                <Button
                    className='list'
                    style={{width:"100%", height:"4rem"}}
                    onClick={()=>setFilterValues({...filterValues, list:{name:"My Recipes"}})}
                >
                    My Recipes
                </Button>
                {lists.map(list => {
                    return(
                        <Button
                            id={list._id}
                            className='list'
                            style={{width:"100%", height:"4rem"}}
                            color={list._id === hovered ? "secondary" : "primary"}
                            variant={list._id === hovered ? "outlined" : "text"}
                            onClick={()=>setFilterValues({...filterValues, list:list})}
                            onDragOver={(e)=>{e.preventDefault(); setHovered(list._id)}}
                            onDragLeave={(e)=>{e.preventDefault(); setHovered("")}}
                            onDrop={()=>{setHovered(""); addToList(dragging,list)}}

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
                <Button icon={<LogoutOutlined/>} type="text" style={{width:"100%"}} onClick={() => setShowConfirmation(true)}>Logout</Button>
                <Modal open={showConfirmation} onCancel={()=>setShowConfirmation(false)} title="Logout?" okText="Logout" cancelText="Nevermind" onOk={()=>logout()}><p>Are you sure you want to logout</p></Modal>
            </div>
        </Drawer> 
    );
}

export default SideBar;