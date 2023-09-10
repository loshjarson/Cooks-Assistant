import React, { useState } from "react";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Paper } from "@mui/material";
import { AutoComplete, Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { selectUserStatus, selectUsernameIdPairs, setFocusedUser } from "./slices/usersSlice";
import { fetchRecipes } from "./slices/recipesSlice";
import { useEffect } from "react";
import { setFocusedList } from "./slices/listsSlice";
import history from "../App/history";
import { PaletteOutlined } from "@mui/icons-material";
import { cycleStep } from "./slices/colorSlice";


function Navbar() {
    const dispatch = useDispatch()
    const sidebarOpen = useSelector((state)=>selectModalByName(state,"sidebarOpen"))
    const userOptions = useSelector(selectUsernameIdPairs)
    const userStatus = useSelector(selectUserStatus)
    const [searchValue, setSearchValue] = useState("")
    
    const toggleSideBar = () => {
        if(window.screen.width > 767){
        if(sidebarOpen){
            //move sidebar toggle button and recipe container to match sidebar
            dispatch(setModal({sidebarOpen:false}))
            if(document.getElementById("recipe-book-container")){
                document.getElementById("recipe-book-container").style.transform=`translate(0px, 5%)`;
                document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";
            } else if(document.getElementById("groceries-container")){
                document.getElementById("groceries-container").style.transform=`translate(0px, 5%)`;
                document.getElementById("groceries-container").style.transition="transform 300ms ease-in-out 100ms";
            }
            document.getElementById("sidebar-toggle").style.transform=`translate(0px, 0)`;
        } else {
            //reset sidebar toggle button and recipe container to match sidebar
            dispatch(setModal({sidebarOpen:true}))

            if(document.getElementById("recipe-book-container")){
                document.getElementById("recipe-book-container").style.transform=`translate(-6vw, 5%)`; 
                document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";
            } else if(document.getElementById("groceries-container")){
                document.getElementById("groceries-container").style.transform=`translate(-6vw, 5%)`; 
                document.getElementById("groceries-container").style.transition="transform 300ms ease-in-out 100ms";
            }

            document.getElementById("sidebar-toggle").style.transform=`translate(-12vw, 0)`; 
        }} else {
            if(sidebarOpen){
                dispatch(setModal({sidebarOpen:false}))
            } else {
                dispatch(setModal({sidebarOpen:true}))
            }
        }
    }

    const handleSelect = (value,option) => {
        setSearchValue(option.label)
        dispatch(setFocusedList(""))
        dispatch(setFocusedUser(option.value))
        dispatch(fetchRecipes(option.value))
        
    }
    
    const handleChange = (e) => {
        e.preventDefault()
        setSearchValue(e.target.value)
    }

    useEffect(()=>{
        if(userStatus === "home"){
            setSearchValue("")
        }
    },[userStatus])

    return (
        <Paper elevation={13} square id="navbar" >
            <Button icon={<PaletteOutlined/>} id="color-cycle" onClick={()=>{dispatch(cycleStep())}}/>
            {history.location.pathname === "/home" ?
                <AutoComplete 
                    className="user-search"
                    options={userOptions} 
                    onSelect={handleSelect} 
                    value={searchValue}
                    filterOption={(inputValue, option) =>
                        {return option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    }
                >
                    <Input.Search onChange={(e)=>handleChange(e)}/>
                </AutoComplete> : null
            }
            
            <Button icon={sidebarOpen? <RightOutlined />:<MenuOutlined/>} type="text" id="sidebar-toggle" onClick={toggleSideBar}/>
        </Paper>
    )
}

export default Navbar;