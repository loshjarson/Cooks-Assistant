import React, { useEffect, useRef, useState } from "react";

import { Button, Input, Form, List, InputNumber, Upload, Select, Alert, Tag } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import VirtualList from "rc-virtual-list"

import { useDispatch, useSelector } from "react-redux";
import { addRecipe, editRecipe, selectFocusedRecipe, selectRecipeById } from "./slices/recipesSlice";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { omit } from "lodash";

//units used in type of measurement dropdown
const unitsOfMeasurement = [
    { 
        value: "",
        label:"N/A"
    },
    {
        value:"tsp",
        label:"Teaspoon"
    },
    {
        value:"Tbs",
        label:"Tablespoon"
    },
    {
        value:"fl oz",
        label:"Fluid Ounce"
    },
    {
        value:"cup",
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
        value:"gal",
        label:"Gallon"
    },
]

const initialState = {
    name: "",
    description: "",
    ingredients: [],
    instructions: {},
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    tags: [],
    image: null,
}


function NewRecipe() {
    const [newIngredient, setNewIngredient] = useState({unit:"",amount:0,name:""})
    const [ingredientExistsError, setIngredientExistsError] = useState(false)
    const [ingredientIncompleteError, setIngredientIncompleteError] = useState(false)

    const [newStep, setNewStep] = useState()
    const [editingStep, setEditingStep] = useState({step:0,instruction:""})
    
    const [tagInputVisible, setTagInputVisible] = useState(false)
    const [newTag, setNewTag] = useState("")
    const tagInputRef = useRef(null)

    const [recipeForm, setRecipeForm] = useState(initialState)
    const [recipeImage, setRecipeImage] = useState("")

    const editing = useSelector(state => selectModalByName(state,"editingRecipe"))

    const recipeId = useSelector(selectFocusedRecipe)
    const recipe = useSelector(state => selectRecipeById(state,recipeId))

    const dispatch = useDispatch()
    
    useEffect(()=>{
        if (editing) {
            const toForm = omit(recipe, "_id")
            setRecipeForm({...toForm});
            setRecipeImage(recipe.image)
        } 
        else setRecipeForm({...initialState})
    },[editing,recipe])
    
    const handleSubmit = () => {
        //check whether user is editing or not to set form
        if (editing) {
            dispatch(editRecipe([recipeId,recipeForm]));
            dispatch(setModal({editingRecipe:false}));
            
        } else {
            dispatch(addRecipe(recipeForm));
            dispatch(setModal({creatingRecipe:false}));
        }
    }
    
    //handles changing form values
    const handleChange = (e,j) => {
        if(e.file){
            setRecipeForm({...recipeForm, image:e.file})
            setRecipeImage(window.URL.createObjectURL(e.file))

        } else if(e.target) {
            setRecipeForm({...recipeForm, [e.target.name]:e.target.value}) 
        } else if(j.includes("prep")){
            setRecipeForm({...recipeForm, [j]:e, totalTime:e+recipeForm.cookTime}) //set prep time and calc new total time
        } else if(j.includes("cook")){
            setRecipeForm({...recipeForm, [j]:e, totalTime:e+recipeForm.prepTime}) //set cook time and calc new total time
        } else {
            setRecipeForm({...recipeForm, [j]:e}) 
        }
    }

    //handles adding a new ingredient
    const addIngredient = () => {
        const foundIngredient = recipeForm.ingredients.find(obj => obj.name === newIngredient.name);
        const incomplete = Boolean(newIngredient.amount <= 0 || newIngredient.name.length < 1)
        if(!foundIngredient && !incomplete){ //adds new ingredient to array
            setRecipeForm({...recipeForm, ingredients:[...recipeForm.ingredients, newIngredient]})  
            setNewIngredient({amount:0,unit:"",name:""})
        } else if (incomplete) {   //if ingredient is already added, alert is raised
            setIngredientIncompleteError(true)
            setNewIngredient({amount:0,unit:"",name:""})
        } else {
            setIngredientExistsError(true)
            setNewIngredient({amount:0,unit:"",name:""})
        }
        
    }

    //closes ingredient already existing alert
    const handleClose = () => {
        setIngredientExistsError(false)
        setIngredientIncompleteError(false)
    }

    //holds new ingredient before it is added
    const handleNewIngredient = (v,n) => {
        setNewIngredient({...newIngredient, [n]:v}) 
    }

    //removes selected ingredient
    const handleRemoveIngredient = (i) => {
        const updatedArray = recipeForm.ingredients.filter(ingredient => ingredient.name !== i)
        setRecipeForm({...recipeForm, ingredients:updatedArray})
    }

    //holds edits to target step
    const handleEditStep=(stepNumber)=>{
        setEditingStep({step:stepNumber, instruction:recipeForm.instructions[stepNumber]})
    }

    //saves the stored edit
    const saveEdit = () => {
        const {step,instruction} = editingStep
        setRecipeForm({...recipeForm, instructions:{...recipeForm.instructions, [step]:instruction}})
        setEditingStep({step:0,instruction:""})
    }

    //delete existing step, currently only works on last step
    const handleDeleteStep=(s)=>{
        const {[s]:value, ...remaining} = recipeForm.instructions
        setRecipeForm({...recipeForm, instructions:remaining})
    }

    //add new step
    const addStep = () => {
        if(newStep.length > 0){
            const stepNumber = Object.keys(recipeForm.instructions).length + 1
            setRecipeForm({...recipeForm, instructions:{...recipeForm.instructions, [stepNumber]:newStep}})
            setNewStep("")
        }
    }

    //stores new tag
    const handleNewTagChange = (e) => {
        setNewTag(e.target.value)
    }
    
    //adds new tag to array
    const handleNewTag = () => {
        if(newTag && recipeForm.tags.indexOf(newTag) === -1){
            setRecipeForm({...recipeForm, tags:[...recipeForm.tags, newTag]})
        }
        setTagInputVisible(false)
        setNewTag("")
    }

    //closes the new tag input
    const handleCloseTag = (t) => {
        const updatedTags = recipeForm.tags.filter(tag => tag !== t)
        setRecipeForm({...recipeForm, tags:updatedTags})
    }

    //auto focus new tag input
    useEffect(()=>{tagInputRef.current?.focus()},[tagInputVisible])

    return (
        <Form id="recipe-form" layout="vertical" >
            <Form.Item className="name-input-container" label="Title">
                <Input id="name-input" name="name" onChange={handleChange} value={recipeForm.name} />
            </Form.Item>
            <div id="tags-container">
                {recipeForm.tags.map((tag) => {
                    return(
                        <Tag closable={true} onClose={() => handleCloseTag(tag)} key={tag}>
                            {tag}
                        </Tag>
                    )
                })}
                {tagInputVisible ? 
                    <Input ref={tagInputRef} size="small" style={{width:78}} onPressEnter={() => handleNewTag()} onChange={(e) => handleNewTagChange(e)} value={newTag} onBlur={() => handleNewTag()}/>
                    : 
                    <Tag onClick={() => {setTagInputVisible(true)}}>
                        <PlusOutlined /> New Tag
                    </Tag>
                }
            </div>
            <div id="description-and-image-input" >
                <Form.Item className="description-input-container" label="Description">
                    <TextArea id="description-input" name="description" onChange={handleChange} value={recipeForm.description} rows={10}/>
                </Form.Item>
                <Form.Item className="image-input-container" label="Recipe Image">
                    <Upload.Dragger id="image-input" name="image" listType="picture-card" customRequest={handleChange} showUploadList={false} style={{width:"100%"}}>
                          {recipeForm.image ? <img src={recipeImage} alt="recipe example" id="recipe-image" style={{width:"80%"}}/> : <div><PlusOutlined/><div>Upload</div></div>}  
                    </Upload.Dragger>
                </Form.Item>
            </div>
            <div id="ingredients-and-steps-inputs" >
                <div id="ingredients-container">
                    <Form.Item className="ingredients" label="Ingredients">
                        <List id="ingredients-list">
                        {ingredientExistsError && (<Alert message="Ingredient is already in list" type="error" closable afterClose={handleClose} />)}
                        {ingredientIncompleteError && (<Alert message="Please fill all fields" type="error" closable afterClose={handleClose} />)}
                        <div id="ingredients-input">
                            <InputNumber className="ingredient-amount-input" placeholder="Amount" name="amount" onChange={(e)=>handleNewIngredient(e,"amount")} value={newIngredient.amount} min={0}/>
                            <Select className="ingredient-unit-input" placeholder="Units" name="unit" options={unitsOfMeasurement} onChange={(e)=>handleNewIngredient(e,"unit")} onClear={(e)=>handleNewIngredient(e,"unit")} value={newIngredient.unit}/>
                            <Input className="ingredient-name-input" placeholder="New Ingredient" name="name" value={newIngredient.name} onChange={(e) => handleNewIngredient(e.target.value.toLowerCase(),"name")}/>
                            <Button className="ingredient-input-submit" onClick={()=>addIngredient()}>Add</Button>
                        </div>
                            <VirtualList
                                id="ingredients" 
                                name="ingredients" 
                                data={recipeForm.ingredients}
                                height={200}
                            >
                                {(ingredient) => (
                                    <List.Item key={ingredient.name} actions={[<DeleteOutlined onClick={()=>{handleRemoveIngredient(ingredient.name)}}/>]}>
                                        <List.Item.Meta
                                            avatar={ingredient.amount + " " + ingredient.unit }
                                            title={ingredient.name}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </Form.Item>
                </div>
                <div id="instructions-container">
                    <Form.Item className="instructions" label="Instructions">
                        <List id="instructions-list" >
                            <div id="step-input">
                                <TextArea id="step-instructions" placeholder="New Step" value={newStep} onChange={(e)=>setNewStep(e.target.value)} onPressEnter={()=>addStep()} autoSize/>
                                <Button id="step-instructions-submit" onClick={()=>addStep()}>Add</Button>
                            </div>
                            <VirtualList
                                id="instructions" 
                                name="instructions" 
                                data={Object.keys(recipeForm.instructions)}
                                height={200}
                            >
                                {(stepNumber) => (
                                    <List.Item key={stepNumber} actions={[editingStep.step === parseInt(stepNumber) ? <CheckOutlined onClick={()=>{saveEdit()}}/> : <EditOutlined onClick={()=>{handleEditStep(stepNumber)}}/>,parseInt(stepNumber) === Object.keys(recipeForm.instructions).length && <DeleteOutlined onClick={()=>{handleDeleteStep(stepNumber)}}/>]}>
                                        <List.Item.Meta
                                            avatar={stepNumber}
                                            description={editingStep.step === parseInt(stepNumber) ? <TextArea value={editingStep.instruction} onChange={e=>setEditingStep({...editingStep, instruction:e.target.value})}/> : recipeForm.instructions[stepNumber]}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </Form.Item>
                    
                    
                </div>
            </div>
            <div id="time-and-servings">
                <Form.Item id="prep-time-input" label="Prep Time">
                    <InputNumber id="prep-time-input" name="prepTime" onChange={(e) => {handleChange(e,"prepTime")}} value={recipeForm.prepTime} min={0} addonAfter="min"/>
                </Form.Item>
                <Form.Item id="cook-time-input" label="Cook Time">
                    <InputNumber id="cook-time-input" name="cookTime" onChange={(e) => {handleChange(e,"cookTime")}} value={recipeForm.cookTime} min={0} addonAfter="min"/>
                </Form.Item>
                <Form.Item id="total-time-input" label="Total Time">
                    <InputNumber id="total-time-input" name="totalTime" onChange={(e) => handleChange(e,"totalTime")} value={recipeForm.totalTime} min={0} addonAfter="min"/>
                </Form.Item>
                <Form.Item id="servings-input" label="Servings">
                    <InputNumber id="servings-input" name="servings" onChange={(e) => handleChange(e,"servings")} value={recipeForm.servings} min={0}/>
                </Form.Item>  
            </div>
            <Form.Item className="recipe-submit">
                <Button onClick={handleSubmit}>Submit Changes</Button>
            </Form.Item>
        </Form>
    );
}

export default NewRecipe;

