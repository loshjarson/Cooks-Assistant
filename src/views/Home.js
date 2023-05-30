import { Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";

function Home() {
    return (
        <div>
            <Routes>
                <Route path="/recipes" Component={Recipes}/>
            </Routes>
        </div>
            
    );
}

export default Home;