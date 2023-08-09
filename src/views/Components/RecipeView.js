import { Typography } from '@mui/material';
import { Tag, List } from 'antd';
import React from 'react';
import VirtualList from "rc-virtual-list"

function RecipeView ({recipe, colorTag, getReadableFontColor}) {

    return ( <div>
            <Typography variant='h2' align='center'>{recipe.name}</Typography>
            <div style={{width:"fit-content", margin:"auto", display:"flex", flexFlow:"row wrap", justifyContent:"center"}}>
                {recipe.tags.map((tag,index) => {
                    return(
                    <Tag color={colorTag(tag)} style={{color:getReadableFontColor(colorTag(tag)), margin:"auto .5rem 1rem .5rem"}}>
                        {tag}
                    </Tag>
                    )
                })}
            </div>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <div style={{width:"60%", margin:"auto 0", height:"100%" }}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", margin:"0 auto auto auto", width:"60%"}}>
                        <Typography id="prep-time" name="prepTime" >Prep time: {recipe.prepTime} min</Typography>

                        <Typography id="cook-time" name="cookTime" >Cook time: {recipe.cookTime} min</Typography>

                        <Typography id="total-time" name="totalTime">Total time: {recipe.totalTime} min</Typography>

                        <Typography id="servings" name="servings">Servings: {recipe.servings}</Typography> 
                    </div>
                   <div style={{height:"14rem", overflow:"scroll", margin:"4rem auto"}} label="Description">
                    
                        <Typography id="description" name="description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consequat semper viverra nam libero. Aliquam ut porttitor leo a diam sollicitudin tempor. Est placerat in egestas erat imperdiet sed euismod. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Sem integer vitae justo eget magna fermentum. Cursus sit amet dictum sit amet justo. Nunc pulvinar sapien et ligula. Nec ullamcorper sit amet risus nullam eget felis eget nunc. Eu sem integer vitae justo. Blandit libero volutpat sed cras ornare arcu dui.

    Dictumst quisque sagittis purus sit amet. Enim praesent elementum facilisis leo vel. Aliquam ut porttitor leo a diam sollicitudin tempor id eu. Venenatis lectus magna fringilla urna porttitor rhoncus. Sed euismod nisi porta lorem. Enim nunc faucibus a pellentesque sit. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Non consectetur a erat nam at lectus urna duis. Blandit turpis cursus in hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat vivamus at augue. Tempor nec feugiat nisl pretium fusce id velit ut. Urna cursus eget nunc scelerisque viverra mauris. In arcu cursus euismod quis viverra nibh cras. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Cursus in hac habitasse platea. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget.

    Urna id volutpat lacus laoreet. Amet facilisis magna etiam tempor orci. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Lacus luctus accumsan tortor posuere ac ut consequat semper viverra. Sed egestas egestas fringilla phasellus faucibus. Nunc consequat interdum varius sit amet. Arcu risus quis varius quam quisque id diam. A scelerisque purus semper eget. Neque laoreet suspendisse interdum consectetur libero id faucibus. Aliquam sem fringilla ut morbi tincidunt augue. Eget velit aliquet sagittis id consectetur purus. Nisl vel pretium lectus quam id.

    Orci nulla pellentesque dignissim enim. Volutpat consequat mauris nunc congue nisi vitae suscipit. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Quam quisque id diam vel quam elementum pulvinar. Lectus magna fringilla urna porttitor rhoncus. Risus ultricies tristique nulla aliquet. In ante metus dictum at tempor. Nisl tincidunt eget nullam non nisi est sit. Malesuada proin libero nunc consequat interdum. Fames ac turpis egestas sed tempus urna et pharetra.

    Tortor at risus viverra adipiscing at in tellus. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Donec pretium vulputate sapien nec sagittis aliquam. Eget egestas purus viverra accumsan in nisl nisi. Sapien faucibus et molestie ac. Aliquet enim tortor at auctor urna nunc. Pretium viverra suspendisse potenti nullam. Molestie ac feugiat sed lectus. Adipiscing enim eu turpis egestas. Sed libero enim sed faucibus turpis in eu mi bibendum. Viverra suspendisse potenti nullam ac tortor vitae purus. Eget gravida cum sociis natoque penatibus et magnis. Sagittis orci a scelerisque purus semper eget duis at. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Sit amet dictum sit amet justo donec enim diam. Eros in cursus turpis massa tincidunt dui ut. Magna fermentum iaculis eu non. Blandit cursus risus at ultrices mi. In nibh mauris cursus mattis.
                        </Typography>
                    </div> 
                </div>
                
                <div label="Recipe Image" style={{width:"30%"}}>
                    <img src={`data:image/png;base64,${recipe.image}`} alt="recipe preview" style={{width:"80%", maxHeight:"20rem", objectFit:"cover"}} />
                </div>
            </div>
            
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", marginTop:"1rem"}}>
                <div style={{width:"45%"}}>
                    <div label="Ingredients" style={{width:"100%"}}>
                        <List style={{border:"1px dashed grey", padding:"0 1rem"}}>
                            <VirtualList
                                id="ingredients" 
                                name="ingredients" 
                                data={recipe.ingredients}
                                height={200}
                            >
                                {(ingredient) => (
                                    <List.Item key={ingredient.name}>
                                        <List.Item.Meta
                                            avatar={ingredient.amount + " " + ingredient.unit}
                                            title={ingredient.name}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </div>
                </div>
                <div style={{width:"45%"}}>
                    <div label="Instructions" style={{width:"100%"}}>
                        <List style={{border:"1px dashed grey", padding:"0 1rem"}}>
                            <VirtualList
                                id="instructions-list" 
                                name="instructions" 
                                data={Object.keys(recipe.instructions)}
                                height={200}
                            >
                                {(stepNumber) => (
                                    <List.Item key={stepNumber}>
                                        <List.Item.Meta
                                            avatar={stepNumber}
                                            description={recipe.instructions[stepNumber]}
                                            />
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </div>
                </div>
            </div>
            
    </div> );
}

export default RecipeView ;