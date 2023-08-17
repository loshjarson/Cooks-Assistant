import { Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import history from "../history";
import axios from "axios";
import SideBar from "./Components/SideBar";
import {Buffer} from 'buffer'


function Home() {
    const [authenticated,setAuthenticated] = useState(false)
    const [recipes, setRecipes] = useState([]);
    const [lists, setLists] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [focusedList, setFocusedList] = useState("My Recipes")
    const [dragging, setDragging] = useState("")

    const filterRecipes = (dynamicFilter, listName) => {
        const filtered = recipes.filter((recipe)=>dynamicFilter(recipe))
        setFilteredRecipes(filtered)
        listName ? setFocusedList(listName) : setFocusedList("My Recipes") // NOTE: Null check could be moved to an effect hook (useEffect()).
    }

    const getMyRecipes = () => {
        axios.get(`http://localhost:8000/recipes/${sessionStorage.getItem("userId")}`, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                console.log(res.data)
                res.data.recipes.map((recipe,i) => {
                    // NOTE: Good opportunity for a comment explaining why this is done.
                    if(recipe.image){
                        const base64String = Buffer.from(recipe.image).toString('base64');
                        res.data.recipes[i] = {...recipe._doc, image:base64String} 
                    }
                })
                setRecipes(res.data.recipes)
                setFilteredRecipes(res.data.recipes) // NOTE: Every time your base recipes are updated, it'd be good to update your filtered list (effect hook).
                setFocusedList("My Recipes") // NOTE: Could move this to a resetFocusedList() function to centralize the behavior.
            })
            .catch(e => {
                console.log(e)
            })
    }

    const getMyRecipeLists = () => {
        axios.get(`http://localhost:8000/recipelists/${sessionStorage.getItem("userId")}`, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                setLists(res.data.recipeLists)
            })
            .catch(e => {
                // NOTE: This is fine for now, but good practice is to gracefully handle this and allow the user to retry the fetch.
                console.log(e)
            })
    }

    useEffect(()=>{
        if(!sessionStorage.getItem("token")){
            history.push("/")
            history.go("/")
        } else {
            axios({
                method:"post",
                url:"http://localhost:8000/auth/authenticate",
                headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`},
            }).then(res => {
                setAuthenticated(res.status === 200)
            })
            .catch(function(e){
                if(e.response.status === 403){
                    history.push("/")
                    history.go("/")
                }
            })
            getMyRecipes()
            getMyRecipeLists()
        }
    },[])

    return (
        <div>
            
            <Navbar setOpen={setOpen} open={open}/>
            <SideBar open={open} lists={lists} setLists={setLists} filterRecipes={filterRecipes} dragging={dragging} setDragging={setDragging}/>
            <div>
            {authenticated ? 
                <Routes>
                    <Route exact path="/home" element={
                        <Recipes 
                            getMyRecipes={getMyRecipes} 
                            recipes={recipes} 
                            setRecipes={setRecipes} 
                            lists={lists} 
                            setLists={setLists} 
                            filteredRecipes={filteredRecipes} 
                            setFilteredRecipes={setFilteredRecipes}
                            focusedList={focusedList}
                            filterRecipes={filterRecipes}
                            setDragging={setDragging}
                        />}/> 
                </Routes>
            : null}
            </div>
        </div>
            
    );
}

export default Home;