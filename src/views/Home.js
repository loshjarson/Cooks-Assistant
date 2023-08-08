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
    const [filterValues, setFilterValues] = useState({search:"",prep:null, cook:null, total:null, list:{name:"My Recipes"}})

    useEffect(()=>{
        //compare recipes to filter object
        let filteredList = recipes.filter((recipe)=>{
            let matchesFilter = true;
            let finished = false;
            while(matchesFilter && !finished) {
                //checks recipe names, tags, and ingredients for search value
                if(filterValues.search.length > 0){
                    const search = filterValues.search.toLowerCase()
                    const inName = recipe.name.toLowerCase().includes(search)
                    const inTags = recipe.tags.map((tag)=>tag.toLowerCase()).includes(search)
                    const inIngredients = recipe.ingredients.map((i)=>i.name.toLowerCase()).includes(search)
                    matchesFilter = inName || inTags || inIngredients
                }
                //checks if recipe is in focused list unless user is on My Recipes page
                if(filterValues.list.name !== "My Recipes") {
                    matchesFilter = filterValues.list.recipes.includes(recipe._id)
                }
                finished = true
            }
            return matchesFilter
        })
        setFilteredRecipes(filteredList)
    },[filterValues,recipes])

    const getMyRecipes = () => {
        axios.get(`http://localhost:8000/recipes/${sessionStorage.getItem("userId")}`, {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                console.log(res.data)
                res.data.recipes.map((recipe,i) => {
                    if(recipe.image){
                        const base64String = Buffer.from(recipe.image).toString('base64');
                        res.data.recipes[i] = {...recipe._doc, image:base64String} 
                    }
                })
                setRecipes(res.data.recipes)
                setFilteredRecipes(res.data.recipes)
                setFocusedList({name:"My Recipes"})
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
            <SideBar open={open} lists={lists} setLists={setLists} dragging={dragging} setDragging={setDragging} filterValues={filterValues} setFilterValues={setFilterValues}/>
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
                            focusedList={focusedList}
                            setDragging={setDragging}
                            filterValues={filterValues}
                            setFilterValues={setFilterValues}
                        />}/> 
                </Routes>
            : null}
            </div>
        </div>     
    );
}

export default Home;