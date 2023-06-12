import { CardHeader, CardMedia, Divider, IconButton, Paper, TextField, } from "@mui/material";
import { FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Modal, Tag } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NewRecipe from "./Components/NewRecipe";

const initialFormState = {
    name: "",
    description: "",
    ingredients: [],
    instructions: {},
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    owner: "",
    tags: [],
}

function Recipes() {
    const [recipeForm, setRecipeForm] = useState(initialFormState)
    const [recipes, setRecipes] = useState([
        {
            name: "strawberry pudding",
            description: "a delicious treat to bring to a party",
            ingredients: [
                {
                name: "milk",
                amount: 1,
                unit: "cup"
                },
                {
                name: "sugar",
                amount: 1,
                unit: "tsp"
                },
            ],
            instructions: ["put the milk in a bowl","wow", "holy shit"],
            prepTime: 35,
            cookTime: 55,
            totalTime: 90,
            servings: 8,
            owner: "Joshua",
            tags: ["dessert", "family", "cast-iron", "meal", "delicious"],
            createdAt: { type: Date, default: () => Date.now(), immutable:true },
            updatedAt: { type: Date, default: () => Date.now() }
        }
    ]);

    //controls whether or no to show new recipe module
    const [ adding, setAdding ] = useState(false)

    //sets unique color for every word to have good looking tags
    const colorTag = (string) => {

    
        //alert(string.length);
    
        if(string.length === 0){
            return "hsl(0, 0, 100%)"
        }else{
            var sanitized = string.replace(/[^A-Za-z]/, '');
            var letters = sanitized.split('');
    
            //Determine the hue
                var hue = Math.floor((letters[0].toLowerCase().charCodeAt()-96)/26*360);
                var ord = '';
                for(var i in letters){
                    ord = letters[i].charCodeAt();
                    if((ord >= 65 && ord <= 90) || (ord >= 97 && ord <= 122)){
                        hue += ord-64;
                    }
                }
    
                hue = hue%360;
    
            //Determine the saturation
                var vowels = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u'];
                var count_cons = 0;
    
                //Count the consonants
                for(i in letters){
                    if(vowels.indexOf(letters[i]) === -1){
                        count_cons++;
                    }
                }
    
                //Determine what percentage of the string is consonants and weight to 95% being fully saturated.
                var saturation = count_cons/letters.length/0.95*100;
                if(saturation > 100) saturation = 100;
    
            //Determine the luminosity
                var ascenders = ['t','d','b','l','f','h','k'];
                var descenders = ['q','y','p','g','j'];
                var luminosity = 50;
                var increment = 1/letters.length*50;
    
                for(i in letters){
                    if(ascenders.indexOf(letters[i]) !== -1){
                        luminosity += increment;
                    }else if(descenders.indexOf(letters[i]) !== -1){
                        luminosity -= increment*2;
                    }
                }
                if(luminosity > 100) luminosity = 100;
    
            return "hsl("+hue+", "+saturation+"%, "+luminosity+"%)";
        }
    }


    // useEffect(()=>{
    //     axios.get(`http://localhost:8000/recipes/${sessionStorage.getItem("userId")}`, {headers:{authorization:`bearer ${sessionStorage.getItem("token")}`}})
    //         .then(res => {
    //             setRecipes(res.data.recipes)
    //         })
    //         .catch(e => {
    //             console.log(e)
    //         })
    // },[])

    return (
        <div>
            <Paper 
            className="recipe-book-container"
            elevation={12} 
            style={{
                width: "80vw",
                height: "85vh",
                margin: "auto",
                transform: "translate(0,5%)",
            }}>
                <div style={{display:"flex", justifyContent:"space-around"}}>
                    <div className="filter-container" style={{display:"flex", justifyContent:"space-around", width:"30rem"}}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" style={{width:"20rem", margin:"1rem"}}/>
                        <IconButton style={{margin:"auto"}}><FilterOutlined/></IconButton>  
                    </div>
                    
                    <div style={{margin:"auto 2rem auto auto", right:"0", display:"flex", justifySelf:"right"}} className="new-recipe-button-container">
                        <Button onClick={()=>setAdding(true)}><PlusOutlined/>New Recipe</Button>
                    </div>
                </div>
                <Divider/>
                <div>
                    {recipes.map(recipe => {
                        return(
                            <Card style={{ maxWidth: 345 }}>
                                <CardHeader
                                    title= {recipe.name}
                                    subheader={`prep: ${recipe.prepTime}min, cook: ${recipe.cookTime}min, total: ${recipe.totalTime}min`}
                                />
                                <CardMedia>

                                </CardMedia>
                            </Card>
                        )
                    })}  
                </div>
            </Paper>
            <Modal open={adding} onCancel={()=>{setAdding(false); setRecipeForm(initialFormState)}} style={{minWidth:"80vw"}}>
                <NewRecipe recipeForm={recipeForm} setRecipeForm={setRecipeForm}/>
            </Modal>
        </div>
    );
}

export default Recipes;