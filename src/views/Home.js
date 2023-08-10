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
    const [dragging, setDragging] = useState("")
    const [filterValues, setFilterValues] = useState({search:"",prepTime:[0,Infinity], cookTime:[0,Infinity], totalTime:[0,Infinity], list:{name:"My Recipes"}})
    const [tagsInFilter, setTagsInFilter] = useState([])
    const [ingredientsInFilter, setIngredientsInFilter] = useState([])

    useEffect(()=>{
        //compare recipes to filter object
        let filteredList = recipes.filter((recipe)=>{
            let matchesFilter = true;
            //checks recipe names, tags, and ingredients for search value
            if(filterValues.search.length > 0){
                const search = filterValues.search.toLowerCase()
                const inName = recipe.name.toLowerCase().includes(search)
                const inTags = recipe.tags.map((tag)=>tag.toLowerCase()).includes(search)
                const inIngredients = recipe.ingredients.map((i)=>i.name.toLowerCase()).includes(search)
                matchesFilter = inName || inTags || inIngredients
                //escapes if filter not met
                if(!matchesFilter) return false
            }
            //checks if recipe is in focused list unless user is on My Recipes page
            if(filterValues.list.name !== "My Recipes") {
                matchesFilter = filterValues.list.recipes.includes(recipe._id)
                //escapes if filter not met
                if(!matchesFilter) return false
            }
            if(filterValues.prepTime[0] !== 0 || filterValues.prepTime[1] !== Infinity){
                matchesFilter = recipe.prepTime >= filterValues.prepTime[0] && recipe.prepTime <= filterValues.prepTime[1]
                if(!matchesFilter) return false
            }
            if(filterValues.cookTime[0] !== 0 || filterValues.cookTime[1] !== Infinity){
                matchesFilter = recipe.cookTime >= filterValues.cookTime[0] && recipe.cookTime <= filterValues.cookTime[1]
                if(!matchesFilter) return false
            }
            if(filterValues.totalTime[0] !== 0 || filterValues.totalTime[1] !== Infinity){
                matchesFilter = recipe.totalTime >= filterValues.totalTime[0] && recipe.totalTime <= filterValues.totalTime[1]
                if(!matchesFilter) return false
            }
            return matchesFilter
        })
        const tagsToFilter = []
        filteredList.forEach(recipe => {
            tagsToFilter.push(...recipe.tags.filter(tag => !tagsToFilter.includes(tag)))
        })
        const ingredientsToFilter = []
        filteredList.forEach(recipe => {
            ingredientsToFilter.push(...recipe.ingredients.map(ingredient => {return ingredient.name.toLowerCase()}).filter(ingredient => !ingredientsToFilter.includes(ingredient)))
        })
        setIngredientsInFilter(ingredientsToFilter)
        setTagsInFilter(tagsToFilter)
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
                            setDragging={setDragging}
                            filterValues={filterValues}
                            setFilterValues={setFilterValues}
                            tagsInFilter={tagsInFilter}
                            ingredientsInFilter={ingredientsInFilter}
                        />}/> 
                </Routes>
            : null}
            </div>
        </div>     
    );
}

export default Home;