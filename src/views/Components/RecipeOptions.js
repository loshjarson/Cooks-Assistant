import React, { useState } from "react";
import { Form, Input, Menu, Modal } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";

function RecipeOptions(args) {
    const {lists, recipe, setLists} = args
    const [addingList, setAddingList] = useState(false)
    const [ newListName, setNewListName ] = useState("")

    const handleSelect = (e) => {
        console.log(e)

        if(e.key === "newList") {
            setAddingList(true) 
        }
    }

    const handleSubmit = () => {
        const recipeListData = new FormData()
        recipeListData.append("recipes",JSON.stringify([recipe]))
        recipeListData.append("name",newListName)

        console.log(recipeListData)
        axios.post(
            `http://localhost:8000/lists/`,
            {recipes:JSON.stringify([recipe]),name:newListName},
            {
                headers: {
                    'authorization': `bearer ${sessionStorage.getItem("token")}`,
                },
            }
        ).then(res => {
            setLists([...lists,res.data.recipeList])
            setAddingList(false)
            setNewListName("")
        })
        .catch(function(e){
            console.log(e)
            setAddingList(false)
        })
    }

    function getItem(label, key, icon, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
    }

    const addToListItems = [getItem("New list","newList",null,null,null), ...lists.map(list => {
        const {name,_id} = list
        return getItem(name,_id,null,null,null)
    })]

    const mainMenu = [getItem("Add to list","addToList",<PlusOutlined/>,addToListItems,null)]

    return(
        <div>
          <Menu
            onClick={handleSelect}
            selectable={false}
            style={{width:200}}
            mode="vertical"
            items={mainMenu}
        />  
        <Modal open={addingList} onCancel={()=>setAddingList(false)} title="New List" okText={"Create"} onOk={()=>handleSubmit()}>
            <Form>
                <FormItem label="List name">
                    <Input value={newListName} onChange={(e)=>setNewListName(e.target.value)}/>
                </FormItem>
            </Form>
        </Modal>
        </div>
        
    )
}

export default RecipeOptions