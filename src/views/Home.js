import { Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import Navbar from "./Components/Navbar";

function Home() {
    return (
        <div>
            <Navbar/>
            <Routes>
                <Route exact path="/" Component={Recipes}/>
            </Routes>
        </div>
            
    );
}

export default Home;