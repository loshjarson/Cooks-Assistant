import { Paper } from "@mui/material";
import { Button, Card, Checkbox, Divider, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { calculateGroceries, decreaseQuantity, editGroceries, increaseQuantity, selectIngredients, selectRecipeQuantities } from "./slices/grocerySlice";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { selectAllRecipes } from "./slices/recipesSlice";
import { SettingsOutlined } from "@mui/icons-material";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";


function GroceryList() {
    const ingredients = useSelector(selectIngredients)
    const recipes = useSelector(selectRecipeQuantities)
    const recipeData = useSelector(selectAllRecipes)
    const viewingGroceryRecipes = useSelector(state => selectModalByName(state, "viewingGroceryRecipes"))
    const dispatch = useDispatch()



    return (
        <div>
            <Paper
            className="groceries-container"
            id="groceries-container"
            elevation={12}>
                <div id="title-bar" >
                    <Typography.Title id="grocery-title" level={2}>Grocery List</Typography.Title>
                    <Button id="grocery-settings" icon={<SettingsOutlined/>} onClick={()=>dispatch(setModal({viewingGroceryRecipes:true}))}></Button>
                </div>
                <Divider/>
                <div id="ingredients">
                    {
                        Object.keys(ingredients).map(ingredient => {
                            let prefix;
                            if(ingredients[ingredient].overflow && ingredients[ingredient].amount){
                                prefix = `${ingredients[ingredient].amount.val} ${ingredients[ingredient].amount.unit} & ${ingredients[ingredient].overflow}`
                            } else if(ingredients[ingredient].overflow){
                                prefix = ingredients[ingredient].overflow
                            } else {
                                prefix = `${ingredients[ingredient].amount.val} ${ingredients[ingredient].amount.unit}`
                            }
                            return (<Checkbox key={ingredient} style={{margin:"1rem", display:"flex"}}><span style={{marginRight:"1rem"}}>{prefix}</span><span>{ingredient.replaceAll("#"," ")}</span></Checkbox>)
                        })
                    }
                </div>
            </Paper>
            <Modal open={viewingGroceryRecipes} onCancel={()=>{dispatch(editGroceries());dispatch(calculateGroceries());dispatch(setModal({viewingGroceryRecipes:false}))}} title="Recipes" footer={null} >
                {
                    Object.keys(recipes).map(recipe => {
                        if(recipeData[recipe]){
                          const {image, name} = recipeData[recipe]
                        return(
                            <Card 
                                key={recipe} 
                                style={{height:100, overflow:"hidden"}} 
                                bodyStyle={{padding:5, height:100, display:"flex", alignContent:"center",justifyContent:"left"}}
                            >
                                <img style={{maxWidth:100}} alt={name} src={image}/> 
                                <Typography.Title ellipsis level={4} style={{margin: "auto 0 auto 1rem"}}>{name}</Typography.Title>
                                <div className="quantity-input">
                                    <Button className="quantity-input__modifier quantity-input__modifier--left" onClick={()=>{dispatch(decreaseQuantity(recipe))}}>
                                    <MinusOutlined/>
                                    </Button>
                                    <input className="quantity-input__screen" type="text" value={recipes[recipe]} readOnly/>
                                    <Button className="quantity-input__modifier quantity-input__modifier--right" onClick={()=>{dispatch(increaseQuantity(recipe))}}>
                                     <PlusOutlined/>
                                    </Button>  
                                </div> 
                                </Card>)  
                        }
                        else return null
                        
                    }
                    )
                }
            </Modal>
        </div>
    );
}

export default GroceryList;