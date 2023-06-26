import { Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import history from "../history";
import axios from "axios";

function Home() {
    const [authenticated,setAuthenticated] = useState(false)

    useEffect(()=>{
        if(!sessionStorage.getItem("token")){
            history.push("/")
            history.go("/")
        } else {
            axios.post("http://localhost:8000/auth/authenticate", {headers:{'authorization':`bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                setAuthenticated(true)
            })
            .catch(function(e){
                if(e.response.status === 403){
                    history.push("/")
                    history.go("/")
                }
            })
        }
    },[])

    return (
        <div>
            
            <Navbar/>
            <Routes>
                {authenticated ? <Route exact path="/" Component={Recipes}/> : null}
            </Routes>
        </div>
            
    );
}

export default Home;