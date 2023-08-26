import React, { useState } from "react";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Paper } from "@mui/material";
import { AutoComplete, Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { selectFocusedUserId, selectUserStatus, selectUsernameIdPairs, setFocusedUser } from "./slices/usersSlice";
import { fetchRecipes } from "./slices/recipesSlice";
import { useEffect } from "react";


function Navbar() {
    const dispatch = useDispatch()
    const sidebarOpen = useSelector((state)=>selectModalByName(state,"sidebarOpen"))
    const userOptions = useSelector(selectUsernameIdPairs)
    const focusedUser = useSelector(selectFocusedUserId)
    const userStatus = useSelector(selectUserStatus)
    const [searchValue, setSearchValue] = useState("")

    const toggleSideBar = () => {
        if(sidebarOpen){
            //move sidebar toggle button and recipe container to match sidebar
            dispatch(setModal({sidebarOpen:false}))

            document.getElementById("recipe-book-container").style.transform=`translate(0px, 5%)`;
            document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";

            document.getElementById("sidebar-toggle").style.transform=`translate(0px, 0)`;
        } else {
            //reset sidebar toggle button and recipe container to match sidebar
            dispatch(setModal({sidebarOpen:true}))
        
            document.getElementById("recipe-book-container").style.transform=`translate(-6vw, 5%)`; 
            document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";

            document.getElementById("sidebar-toggle").style.transform=`translate(-12vw, 0)`; 
        }
    }

    const handleSelect = (value,option) => {
        console.log(value,option)
        setSearchValue(option.label)
        dispatch(setFocusedUser(option.value))
        dispatch(fetchRecipes(option.value))
    }
    
    const handleChange = (e) => {
        e.preventDefault()
        setSearchValue(e.target.value)
    }

    useEffect(()=>{
        console.log(userStatus)
        if(userStatus === "home"){
            console.log(userStatus)
            setSearchValue("")
        }
    },[userStatus])

    return (
        <Paper elevation={12} square style={{
            width: "100vw",
            height: "6vh",
            minHeight: "50px",
            display: "flex",
            alignContent:"center",
            borderBottom:"1px solid rgb(172, 172, 172)"
            }}>
            <AutoComplete 
                style={{margin:"auto -6rem auto auto", width:"20vw"}} 
                options={userOptions} 
                onSelect={handleSelect} 
                value={searchValue}
                filterOption={(inputValue, option) =>
                    {return option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  }
            >
                <Input.Search onChange={(e)=>handleChange(e)}/>
            </AutoComplete>
            <Button icon={sidebarOpen? <RightOutlined />:<MenuOutlined/>} type="text" style={{margin:"auto .5rem auto auto",transition:"300ms ease-in-out 100ms"}} id="sidebar-toggle" onClick={toggleSideBar}/>
        </Paper>
    )
}

export default Navbar;