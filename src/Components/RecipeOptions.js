import React from "react";

import { Menu } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import {editList, selectAllLists } from "./slices/listsSlice";
import { setModal } from "./slices/modalsSlice";


function RecipeOptions({recipe}) {
    const dispatch = useDispatch()
    
    const lists = useSelector(selectAllLists)


    const handleSelect = (e) => {
        if(e.key === "newList") {
            dispatch(setModal({creatingList:true}))
        } else if (e.key === "edit") {
            dispatch(setModal({editingRecipe:true}))
        } else if (e.key === "delete") {
            dispatch(setModal({deletingRecipe:true}))
        } else {
            dispatch(editList([recipe._id,e.key]))
        }
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

    const addToListItems = [getItem("New list","newList",null,null,null), {type:"divider"}, ...Object.values(lists).map(list => {
        const {name,_id} = list
        return getItem(name,_id,null,null,null)
    })]

    const mainMenu = [getItem("Add to list","addToList",<PlusOutlined/>,addToListItems,null), getItem("Edit recipe", "edit", <EditOutlined/>,null,null), getItem("Delete recipe", "delete", <DeleteOutlined/>, null, null)]

    return(
        <div onClick={(e)=>{
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            }}
        >
            <Menu
                onClick={handleSelect}
                selectable={false}
                style={{width:200}}
                mode="vertical"
                items={mainMenu}
            />  
        </div>
        
    )
}

export default RecipeOptions