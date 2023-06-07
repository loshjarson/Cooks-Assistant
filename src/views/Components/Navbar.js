import { Paper } from "@mui/material";
import { Button, Input } from "antd";
const {Search} = Input

function Navbar() {
    return (
        <Paper elevation={12} style={{
            width: "100vw",
            height: "6vh",
            minHeight: "50px",
            display: "flex",
            justifyContent: "center",
            alignContent:"center"
            }}>
            <Search style={{width:"20vw", margin:"auto"}}/>
        </Paper>
    );
}

export default Navbar;