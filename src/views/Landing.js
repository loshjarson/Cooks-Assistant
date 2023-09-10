import { useState } from "react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { Paper, Button, createTheme, ThemeProvider } from "@mui/material";

const muiTheme = createTheme({
    components:{
        MuiDrawer: {
            styleOverrides: {
                paper:{
                    backgroundColor: "rgba(210, 221, 231, 0.963)"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root:{
                    backgroundColor: "rgba(96, 130, 162, 0.963)",
                    borderRadius: 0,
                }
            }
        },
        MuiPaper:{
            styleOverrides: {
                elevation13: {
                    backgroundColor: "rgba(96, 130, 162, 0.887)"
                },
                elevation12: {
                    backgroundColor: "rgba(96, 130, 162, 0.963)"
                },
            }
        },
        MuiPopover:{
            styleOverrides: {
                paper: {
                   backgroundColor: "rgb(210 221 231)"
                }
                
            }
        },
        MuiCard:{
            styleOverrides:{
                root:{
                    backgroundColor: "rgba(182 212 240)"
                }
            }
        }

    },
  })


function Landing() {
    const [isNew, setIsNew ] = useState(false)
    return (
        <div id="landing" >
            <ThemeProvider theme={muiTheme}>
            <Paper elevation={12} id="landing-paper">
                <div> 
                    {isNew ? <Signup/> : <Login/>}
                </div>
                <div style={{textAlign:"center"}}>
                    <Button onClick={() => setIsNew(!isNew)} style={{color:"black"}}>{isNew ? "Already have an account?" : "Are you new here?"}</Button>
                </div>
                
            </Paper>
            </ThemeProvider>  
        </div>
    );
}

export default Landing;