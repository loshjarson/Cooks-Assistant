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
    const [lists, setLists] = useState([])
    const [open, setOpen] = useState(false)

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
            <SideBar open={open}/>
            <div>
            {authenticated ? 
                <Routes>
                    <Route exact path="/home" element={<Recipes getMyRecipes={getMyRecipes} recipes={recipes} setRecipes={setRecipes} lists={lists} setLists={setLists} open={open}/>}/> 
                </Routes>
            : null}
            </div>
        </div>
            
    );
}

export default Home;