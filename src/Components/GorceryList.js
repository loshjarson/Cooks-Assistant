import { Paper } from "@mui/material";
import { Button, Card, Checkbox, Divider, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { calculateGroceries, decreaseQuantity, editGroceries, increaseQuantity, selectIngredients, selectRecipeQuantities } from "./slices/grocerySlice";
import { selectModalByName, setModal } from "./slices/modalsSlice";
import { selectAllRecipes } from "./slices/recipesSlice";
import { SettingsOutlined } from "@mui/icons-material";


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
            elevation={12} 
            style={{
                width: "40vw",
                minWidth:"500px",
                height: "85vh",
                margin: "auto",
                transform: "translate(0,5%)",
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{display:"flex", justifyContent:"center", width:"100%", overflow:"clip"}}>
                    <Typography.Title level={2}>Grocery List</Typography.Title>
                    <Button icon={<SettingsOutlined/>} style={{ margin:"auto 3rem", right:"1rem", top:"2rem", position:"absolute"}} onClick={()=>dispatch(setModal({viewingGroceryRecipes:true}))}></Button>
                </div>
                <Divider/>
                <div style={{display:"flex", flexDirection:"column", overflow:"none", justifyContent:"space-between"}}>
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
                                <Typography.Title level={4} style={{marginLeft: "1rem"}}>{name}</Typography.Title>
                                <div className="quantity-input">
                                    <button className="quantity-input__modifier quantity-input__modifier--left" onClick={()=>{dispatch(decreaseQuantity(recipe))}}>
                                    &mdash;
                                    </button>
                                    <input className="quantity-input__screen" type="text" value={recipes[recipe]} readOnly />
                                    <button className="quantity-input__modifier quantity-input__modifier--right" onClick={()=>{dispatch(increaseQuantity(recipe))}}>
                                    &#xff0b;
                                    </button>  
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