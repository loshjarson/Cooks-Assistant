import { Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import Recipes from "../Components/Recipes";
import Navbar from "../Components/Navbar";
import SideBar from "../Components/SideBar";

import { useDispatch } from "react-redux";
import { fetchAuthenticated } from "../Components/slices/authenticatedSlice";



function Home() {

    const dispatch = useDispatch()

    //check authentication whenever page reloads
    useEffect(()=>{
        dispatch(fetchAuthenticated())
        
    })

    return (
        <div>
            <Navbar/>
            <SideBar/>
            <div> 
                <Routes>
                    <Route exact path="/home" element={<Recipes/>}/> 
                </Routes>
            </div>
        </div>     
    );
}

export default Home;