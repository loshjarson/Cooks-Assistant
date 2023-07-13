import { Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import history from "../history";
import axios from "axios";
import MyLists from "./Components/MyLists";

function Home() {
    const [authenticated,setAuthenticated] = useState(false)

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
            {authenticated ? 
                <Routes>
                    <Route exact path="/" Component={Recipes}/> 
                    <Route path="lists" Component={MyLists}/>
                </Routes>
            : null}
        </div>
            
    );
}

export default Home;