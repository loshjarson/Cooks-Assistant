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


function Home() {
    const recipesStatus = useSelector(selectRecipesStatus)
    const groceriesStatus = useSelector(selectGroceriesStatus)
    const recipes = useSelector(selectRecipeQuantities)


    const debouncedBatch = debounce(()=>
    batch(()=>{
        dispatch(fetchRecipes())
        dispatch(fetchLists())
        dispatch(fetchUsers())
        dispatch(fetchGroceries())
    }), 200)

    const dispatch = useDispatch()

    //check authentication whenever page reloads
    useEffect(()=>{
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
        <div>
            <Navbar/>
            <SideBar/>
            <div> 
                <Routes>
                    <Route exact path="/home" element={<Recipes/>}/> 
                    <Route exact path = "/groceries" element={<GroceryList/>}/>
                </Routes>
            </div>
        </div>     
    );
}

export default Home;