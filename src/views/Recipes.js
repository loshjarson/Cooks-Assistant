import { Divider, Paper } from "@mui/material";

function Recipes() {
    return (
        <Paper elevation={12} style={{
            width: "80vw",
            height: "80vh",
            margin: "auto",
            transform: "translate(0,5%)",
            }}>
                <div className="recipe-search-bar"></div>
                <Divider/>
                <div className="recipe-list"></div>
        </Paper>
    );
}

export default Recipes;