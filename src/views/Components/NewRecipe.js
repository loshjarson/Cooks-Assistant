import React, { useState } from "react";
import { Button, Input, Form, List, InputNumber, Upload, Select, Alert } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import VirtualList from "rc-virtual-list"

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

const unitsOfMeasurement = [
    {
        value:"tsp",
        label:"Teaspoon"
    },
    {
        value:"tbsp",
        label:"Tablespoon"
    },
    {
        value:"fl oz",
        label:"Fluid Ounce"
    },
    {
        value:"c",
        label:"Cup"
    },
    {
        value:"pt",
        label:"Pint"
    },
    {
        value:"qt",
        label:"Quart"
    },
    {
        value:"g",
        label:"Gallon"
    },
]


function NewRecipe() {
    const [recipeForm, setRecipeForm] = useState(initialFormState)
    const [recipePreview, setRecipePreview] = useState()
    const [newIngredient, setNewIngredient] = useState({unit:undefined,amount:undefined,name:undefined})
    const [newStep, setNewStep] = useState()
    const [ingredientError, setIngredientError] = useState(false)

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

    const addIngredient = () => {
        const foundIngredient = recipeForm.ingredients.find(obj => obj.name === newIngredient.name);
        if(!foundIngredient){
            setRecipeForm({...recipeForm, ingredients:[...recipeForm.ingredients, newIngredient]})
            setNewIngredient({unit:undefined,amount:undefined,name:undefined})
        } else {
            setIngredientError(true)
            setNewIngredient({unit:undefined,amount:undefined,name:undefined})
        }
        
    }

    const handleClose = () => {
        setIngredientError(false)
    }

    const addStep = () => {
        if(newStep.length > 0){
            const stepNumber = Object.keys(recipeForm.instructions).length + 1
            setRecipeForm({...recipeForm, instructions:{...recipeForm.instructions, [stepNumber]:newStep}})
            setNewStep("")
            console.log(recipeForm)
        }
    }

    const handleNewIngredient = (v,n) => {
        setNewIngredient({...newIngredient, [n]:v}) 
    }

    const handleRemoveIngredient = (i) => {
        const updatedArray = recipeForm.ingredients.filter(ingredient => ingredient.name !== i)
        setRecipeForm({...recipeForm, ingredients:updatedArray})
    }
    


    return (
        <Form style={{margin:"2rem", minWidth:"80%", fontSize:"50px"}} layout="vertical" >
            <Form.Item style={{width:"25rem", margin:"2rem auto"}} label="Title">
                <Input id="name-input" name="name" onChange={handleChange} value={recipeForm.name} />
            </Form.Item>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <Form.Item style={{width:"60%"}} label="Description">
                    <TextArea id="description-input" name="description" onChange={handleChange} value={recipeForm.description} style={{ height: "23.5rem", resize: 'none' }}/>
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
                        <List style={{border:"1px dashed grey"}}>
                            <VirtualList
                                id="ingredients-list" 
                                name="ingredients" 
                                data={recipeForm.ingredients}
                                height={200}
                            >
                                {(ingredient) => (
                                    <List.Item key={ingredient.name} actions={[<DeleteOutlined onClick={()=>{handleRemoveIngredient(ingredient.name)}}/>]}>
                                        <List.Item.Meta
                                            avatar={ingredient.amount + " " + ingredient.unit}
                                            title={ingredient.name}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </Form.Item>
                    {ingredientError && (<Alert message="Ingredient is already in list" type="error" closable afterClose={handleClose} />)}
                    <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                        <InputNumber placeholder="Amount" name="amount" onChange={(e)=>handleNewIngredient(e,"amount")} value={newIngredient.amount} min={0} style={{width: 150}}/>
                        <Select placeholder="Unit" name="unit" options={unitsOfMeasurement} onChange={(e)=>handleNewIngredient(e,"unit")} value={newIngredient.unit} style={{width: 200}}/>
                        <Input placeholder="New Ingredient" name="name" value={newIngredient.name} onChange={(e) => handleNewIngredient(e.target.value.toLowerCase(),"name")}/>
                        <Button onClick={()=>addIngredient()}>Add</Button>
                    </div>
                </div>
                <div style={{width:"45%"}}>
                    <Form.Item label="Instructions" style={{width:"100%"}}>
                        <List>
                            <VirtualList
                                id="instructions-list" 
                                name="instructions" 
                                data={Object.keys(recipeForm.instructions)}
                                height={200}
                            >
                                {(stepNumber) => (
                                    <List.Item key={stepNumber}>
                                        <List.Item.Meta
                                            avatar={stepNumber}
                                            title={recipeForm.instructions[stepNumber]}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </Form.Item>
                    
                    <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                        <Input placeholder="New Step" value={newStep} onChange={(e)=>setNewStep(e.target.value)}/>
                        <Button onClick={()=>addStep()}>Add</Button>
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

