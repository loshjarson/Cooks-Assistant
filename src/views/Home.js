import { Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import Recipes from "../Components/Recipes";
import Navbar from "../Components/Navbar";
import SideBar from "../Components/SideBar";

import { useSelector, useDispatch, batch } from "react-redux";
import { fetchAuthenticated } from "../Components/slices/authenticatedSlice";
import GroceryList from "../Components/GorceryList";
import { fetchRecipes } from "../Components/slices/recipesSlice";
import { fetchLists } from "../Components/slices/listsSlice";
import { fetchUsers} from "../Components/slices/usersSlice";
import { debounce } from "lodash";
import { calculateGroceries, fetchGroceries, selectGroceriesStatus, selectRecipeQuantities } from "../Components/slices/grocerySlice";
import { selectRecipesStatus, setRecipeStatus } from "../Components/slices/recipesSlice";

import { createTheme,ThemeProvider } from "@mui/material/styles";
import { ConfigProvider } from "antd";
import { selectCycle } from "../Components/slices/colorSlice";

import blueBackground from "../blueBackground.png"
import redBackground from "../redBackground.png"
import greenBackground from "../greenBackground.png"
import history from "../App/history";
import { selectModalByName, setModal } from "../Components/slices/modalsSlice";


const themes = {
    0: {
        antdTheme:{
            components:{
                Button: {
                    defaultBg: "rgba(96, 130, 162, 0.963)",

                },
                Card: {
                    colorBgContainer: "rgba(96, 130, 162, 0.963)",
                    actionsBg: "rgba(66, 63, 63, 0)",
                    
                },
                Modal: {
                    contentBg: "rgb(210 221 231)",
                    headerBg: "rgb(210 221 231)"
                },
                Popover: {
                    colorBgElevated: "rgb(210 221 231)"
                },
                ListItem: {
                    avatarMarginRight:40
                }
            },
            token: {
                colorFillAlter: "rgba(0, 0, 0, 0.10)",
                colorBgContainer: "rgb(233 240 247)",
                colorBorderSecondary: "black",
                
                
            }
        },
        
        muiTheme:createTheme({
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
    },
    1: {
        antdTheme:{
            components:{
                Button: {
                    defaultBg: "rgba(163, 96, 102, 0.963)",

                },
                Card: {
                    colorBgContainer: "rgba(163, 96, 102, 0.963)",
                    actionsBg: "rgba(66, 63, 63, 0)",
                    
                },
                Modal: {
                    contentBg: "rgb(232, 211, 213)",
                    headerBg: "rgb(232, 211, 213)"
                },
                Popover: {
                    colorBgElevated: "rgb(232, 211, 213)"
                }
            },
            token: {
                colorFillAlter: "rgba(0, 0, 0, 0.10)",
                colorBgContainer: "rgb(247, 233, 233)",
                colorBorderSecondary: "black",
                avatarMarginRight:20,
                
            }
        },
        
        muiTheme:createTheme({
            components:{
                MuiDrawer: {
                    styleOverrides: {
                        paper:{
                            backgroundColor: "rgba(232, 211, 213, 0.963)"
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root:{
                            backgroundColor: "rgba(163, 96, 102, 0.963)",
                            borderRadius: 0,
                        }
                    }
                },
                MuiPaper:{
                    styleOverrides: {
                        elevation13: {
                            backgroundColor: "rgba(163, 96, 102, 0.887)"
                        },
                        elevation12: {
                            backgroundColor: "rgba(163, 96, 102, 0.963)"
                        },
                    }
                },
                MuiPopover:{
                    styleOverrides: {
                        paper: {
                           backgroundColor: "rgb(232, 211, 213)"
                        }
                        
                    }
                },
                MuiCard:{
                    styleOverrides:{
                        root:{
                            backgroundColor: "rgba(240, 182, 187)"
                        }
                    }
                }
        
            },
          })
    },
    2: {
        antdTheme:{
            components:{
                Button: {
                    defaultBg: "rgba(96, 163, 102, 0.963)",

                },
                ButtonPrimary:{
                    colorBgContainer: "rgba(96, 163, 102)"
                },
                Card: {
                    colorBgContainer: "rgba(96, 163, 102, 0.963)",
                    actionsBg: "rgba(66, 63, 63, 0)",
                    
                },
                Modal: {
                    contentBg: "rgb(211, 232, 213)",
                    headerBg: "rgb(211, 232, 213)"
                },
                Popover: {
                    colorBgElevated: "rgb(211, 232, 213)"
                }
            },
            token: {
                colorFillAlter: "rgba(0, 0, 0, 0.10)",
                colorBgContainer: "rgb(233, 247, 234)",
                colorBorderSecondary: "black",
                avatarMarginRight:20,
                
            }
        },
        
        muiTheme:createTheme({
            components:{
                MuiDrawer: {
                    styleOverrides: {
                        paper:{
                            backgroundColor: "rgba(211, 232, 213, 0.963)"
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root:{
                            backgroundColor: "rgba(96, 163, 102, 0.963)",
                            borderRadius: 0,
                        }
                    }
                },
                MuiPaper:{
                    styleOverrides: {
                        elevation13: {
                            backgroundColor: "rgba(96, 163, 102, 0.887)"
                        },
                        elevation12: {
                            backgroundColor: "rgba(96, 163, 102, 0.963)"
                        },
                    }
                },
                MuiPopover:{
                    styleOverrides: {
                        paper: {
                           backgroundColor: "rgb(211, 232, 213)"
                        }
                        
                    }
                },
                MuiCard:{
                    styleOverrides:{
                        root:{
                            backgroundColor: "rgba(182, 240, 187)"
                        }
                    }
                }
        
            },
          })
    }
}

const colorKey = {
    0:"url("+blueBackground+")",
    1:"url("+redBackground+")",
    2:"url("+greenBackground+")",
}

function Home() {
    const recipesStatus = useSelector(selectRecipesStatus)
    const groceriesStatus = useSelector(selectGroceriesStatus)
    const recipes = useSelector(selectRecipeQuantities)
    const color = useSelector(selectCycle)
    const sidebarOpen = useSelector(state => selectModalByName(state,"sidebarOpen"))


    const debouncedBatch = debounce(()=>
    batch(()=>{
        dispatch(fetchRecipes())
        dispatch(fetchLists())
        dispatch(fetchUsers())
        dispatch(fetchGroceries())
    }), 200)

    const dispatch = useDispatch()

    const handleClose = () => {
        if(sidebarOpen){
            dispatch(setModal({sidebarOpen:false}))
            if(document.getElementById("recipe-book-container")){
                document.getElementById("recipe-book-container").style.transform=`translate(0px, 5%)`;
                document.getElementById("recipe-book-container").style.transition="transform 300ms ease-in-out 100ms";
            } else if(document.getElementById("groceries-container")){
                document.getElementById("groceries-container").style.transform=`translate(0px, 5%)`;
                document.getElementById("groceries-container").style.transition="transform 300ms ease-in-out 100ms";
            }
            document.getElementById("sidebar-toggle").style.transform=`translate(0px, 0)`;
        }
        
    }


    //check authentication whenever page reloads
    useEffect(()=>{
        if(!sessionStorage.getItem("token")){
            history.push("/")
            history.go("/")
        } 
        debounce(()=>{dispatch(fetchAuthenticated())}, 200)
        
        if(recipesStatus === 'idle') {
            dispatch(setRecipeStatus())
            debouncedBatch()
        }
    })

    useEffect(() => {
        if(groceriesStatus === "fetched" && recipesStatus ==="succeeded"){ 
            dispatch(calculateGroceries());
        }
    },[dispatch,groceriesStatus,recipesStatus,recipes])


    return (
        <div id="home" style={{backgroundImage:colorKey[color], height:"100%", overflow:"hidden"}}>
            <ConfigProvider theme={themes[color].antdTheme}>
                <ThemeProvider theme={themes[color].muiTheme}>
                    <Navbar/>
                    <SideBar/>
                    <div onClick={()=>handleClose()} style={{height:"100%"}}> 
                        <Routes>
                            <Route exact path="/home" element={<Recipes/>}/> 
                            <Route exact path = "/groceries" element={<GroceryList/>}/>
                        </Routes>
                    </div>
                </ThemeProvider>
            </ConfigProvider>
            
        </div>     
    );
}

export default Home;