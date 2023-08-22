import React from "react";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Paper } from "@mui/material";
import { Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectModalByName, setModal } from "./slices/modalsSlice";




const {Search} = Input

function Navbar() {
    const sidebarOpen = useSelector((state)=>selectModalByName(state,"sidebarOpen"))
    const dispatch = useDispatch()

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

    return (
        <Paper elevation={12} square style={{
            width: "100vw",
            height: "6vh",
            minHeight: "50px",
            display: "flex",
            alignContent:"center",
            borderBottom:"1px solid rgb(172, 172, 172)"
            }}>
            <Search style={{width:"20vw", margin:"auto -6rem auto auto"}}/>
                <Button icon={sidebarOpen? <RightOutlined />:<MenuOutlined/>} type="text" style={{margin:"auto .5rem auto auto",transition:"300ms ease-in-out 100ms"}} id="sidebar-toggle" onClick={toggleSideBar}/>
        </Paper>
    );
}

export default Navbar;