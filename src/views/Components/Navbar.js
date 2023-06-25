import React, { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Paper } from "@mui/material";
import { Button, Input } from "antd";
import history from '../../history';

const {Search} = Input

function Navbar() {
    const [showConfirmation, setShowConfirmation] = useState(false)

    const logout = () => {
        sessionStorage.clear()
        history.push("/")
        history.go("/")
    }


    return (
        <Paper elevation={12} style={{
            width: "100vw",
            height: "6vh",
            minHeight: "50px",
            display: "flex",
            alignContent:"center"
            }}>
            <Search style={{width:"20vw", margin:"auto -6rem auto auto"}}/>
            <Button icon={<LogoutOutlined/>} type="text" style={{margin:"auto 1rem auto auto"}} onClick={setShowConfirmation(true)}>Logout</Button>
        </Paper>
    );
}

export default Navbar;