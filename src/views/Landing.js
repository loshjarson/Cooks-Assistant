import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { Paper, Button } from "@mui/material";

function Landing() {
    const [isNew, setIsNew ] = useState(false)
    return (
        <div style={{width:"100vw", height:"100vh", position:"relative"}}>  
            <Paper elevation={12} style={{
                    width: "35vw",
                    height: "auto",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    }}>
                <div> 
                    {isNew ? <Signup/> : <Login/>}
                </div>
                <div style={{textAlign:"center"}}>
                    <Button onClick={() => setIsNew(!isNew)}>{isNew ? "Already have an account?" : "Are you new here?"}</Button>
                </div>
                
            </Paper>
        </div>
    );
}

export default Landing;