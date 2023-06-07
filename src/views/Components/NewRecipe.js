import React, { useState } from "react";
import { Button, Input, Form, List, InputNumber, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

function NewRecipe() {
    const [recipeForm, setRecipeForm] = useState({})
    const [recipePreview, setRecipePreview] = useState()
    const [newIngredient, setNewIngredient] = useState()
    const [newStep, setNewStep] = useState()

    const handleChange = (e,j) => {
        if(e.file){
            setRecipeForm({...recipeForm, image:e.file})

            const imageReader = new FileReader()
            imageReader.onload = function(e) {
                setRecipePreview(e.target.result)
            }
            imageReader.readAsDataURL(e.file)
            console.log(e.file)
        } else if(e.target) {
            setRecipeForm({...recipeForm, [e.target.name]:e.target.value})
        } else {
            setRecipeForm({...recipeForm, [j]:e})
        }
    }

    const addIngredient = (i) => {

    }

    const addStep = (s) => {

    }
    
    return (
        <Form style={{margin:"2rem", minWidth:"80%", fontSize:"50px"}} layout="vertical" >
            <Form.Item style={{width:"25rem", margin:"2rem auto"}} label="Title">
                <Input id="name-input" name="name" onChange={handleChange} value={recipeForm.name} />
            </Form.Item>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <Form.Item style={{width:"60%"}} label="Description">
                    <TextArea id="description-input" name="description" onChange={handleChange} value={recipeForm.description} style={{ height: "20rem", resize: 'none' }}/>
                </Form.Item>
                <Form.Item label="Recipe Image" style={{width:"30%"}}>
                    <Upload.Dragger id="image-input" name="image" listType="picture-card" customRequest={handleChange} showUploadList={false} style={{width:"100%"}}>
                          {recipeForm.image ? <img src={recipePreview} alt="recipe preview" style={{width:"80%"}}/> : <div style={{}}><PlusOutlined/><div>Upload</div></div>}  
                    </Upload.Dragger>
                </Form.Item>
            </div>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <div style={{width:"45%"}}>
                    <Form.Item label="Ingredients" style={{width:"100%"}}>
                        <List id="ingredients-input" name="ingredients" onChange={handleChange}>

                        </List>
                    </Form.Item>
                    <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                        <Input placeholder="New Ingredient"/>
                        <Button>Add</Button>
                    </div>
                </div>
                <div style={{width:"45%"}}>
                    <Form.Item label="Instructions" style={{width:"100%"}}>
                        <List id="instructions-input" name="instructions" onChange={handleChange}>

                        </List>
                    </Form.Item>
                    <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                        <Input placeholder="New Step"/>
                        <Button>Add</Button>
                    </div>
                </div>
            </div>
            
            <Form.Item label="Prep Time">
                <InputNumber id="prep-time-input" name="prepTime" onChange={(e) => handleChange(e,"prepTime")} value={recipeForm.prepTime}/>
            </Form.Item>
            <Form.Item label="Cook Time">
                <InputNumber id="cook-time-input" name="cookTime" onChange={(e) => handleChange(e,"cookTime")} value={recipeForm.cookTime}/>
            </Form.Item>
            <Form.Item label="Total Time">
                <InputNumber id="total-time-input" name="totalTime" onChange={(e) => handleChange(e,"totalTime")} value={recipeForm.totalTime}/>
            </Form.Item>
            <Form.Item label="Servings">
                <InputNumber id="servings-input" name="servings" onChange={(e) => handleChange(e,"servings")} value={recipeForm.servings}/>
            </Form.Item>
            <Form.Item>
                <List id="tags-input" name="tags" onChange={handleChange}>

                </List>
            </Form.Item>
            <Form.Item>
            <Button onClick={() => console.log(recipeForm)}/>
            </Form.Item>
        </Form>
    );
}

export default NewRecipe;

// {
//     name: "strawberry pudding",
//     description: "a delicious treat to bring to a party",
//     ingredients: [
//         {
//         name: "milk",
//         amount: 1,
//         unit: "cup"
//         },
//         {
//         name: "sugar",
//         amount: 1,
//         unit: "tsp"
//         },
//     ],
//     instructions: ["put the milk in a bowl","wow", "holy shit"],
//     prepTime: 35,
//     cookTime: 55,
//     totalTime: 90,
//     servings: 8,
//     owner: "Joshua",
//     tags: ["dessert", "family", "cast-iron", "meal", "delicious"],
//     createdAt: { type: Date, default: () => Date.now(), immutable:true },
//     updatedAt: { type: Date, default: () => Date.now() }
// }