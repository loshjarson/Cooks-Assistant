import React from "react";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Paper } from "@mui/material";
import { Button, Input } from "antd";




const {Search} = Input

function Navbar({open, setOpen}) {

    const toggleSideBar = () => {
        setOpen(!open); 
        
        document.getElementById("recipe-book-container").style.transform=`translate(${open ? "0px":"-6vw"}, 5%)`; 
        document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";

        document.getElementById("sidebar-toggle").style.transform=`translate(${open ? "0px":"-12vw"}, 0)`; 
        
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
            
            <Button icon={open?<RightOutlined/>:<MenuOutlined/>} type="text" style={{margin:"auto .5rem auto auto",transition:"300ms ease-in-out 100ms"}} onClick={()=>{toggleSideBar()}} id="sidebar-toggle"></Button>
            
        </Paper>
    );
}

export default Navbar;