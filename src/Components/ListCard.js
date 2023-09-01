import React, { useState } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';
import { Card, Typography } from "antd";

import { useDispatch, useSelector } from 'react-redux';
import { selectDragging } from './slices/draggableSlice';
import { editList, setFocusedList } from './slices/listsSlice';
import { selectFocusedUserId, setFocusedUser } from './slices/usersSlice';
import { fetchRecipes } from './slices/recipesSlice';
import { Edit, MoreVertOutlined } from '@mui/icons-material';

import { bindTrigger } from 'material-ui-popup-state';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { setModal } from './slices/modalsSlice';



function ListCard ({list}) {
    const dispatch = useDispatch()
    const dragging = useSelector(selectDragging)
    const [ hovering, setHovering ] = useState("")
    const focusedUser = useSelector(selectFocusedUserId)
    const popupState = usePopupState({ variant: 'popover', popupId: list._id })
    const [editingList,setEditingList] = useState("")

    const handleList = (list) => {
        dispatch(setFocusedList(list._id))
        if(focusedUser){
            dispatch(setFocusedUser(null))
            dispatch(fetchRecipes()) 
        }
    }

    
    return ( 
        <div>
        <Card 
            key={list._id}
            id={list._id}
            className='list'
            hoverable
            bodyStyle={{display:"none"}}
            headStyle={{
                borderBottom:"none",
                overflowX:"revert",
            }}
            title={
                <Typography.Title
                    level={5}
                    style={{color: list._id === hovering ? "purple" : "#1976d2", margin:"auto 0", insetInlineStart:0}}
                    editable={{
                        editing: list._id === editingList,
                        icon:<Edit style={{display:"none"}}/>,
                        onChange:(s)=>{ if(list.name !== s){dispatch(editList([null,list._id,s,null]));} setEditingList("")},
                        onEnd:()=>{setEditingList("")}
                    }}
                >
                    {list.name.length > 24 ? list.name.slice(0,20) + "..." : list.name}
                </Typography.Title>} 
            style={{textAlign:"center"}}
            onClick={()=>handleList(list)}
            onDragOver={(e)=>{e.preventDefault(); setHovering(list._id)}}
            onDragLeave={(e)=>{e.preventDefault(); setHovering("")}}
            onDrop={(e)=>{e.preventDefault(); dispatch(editList([dragging,hovering,null,null])); setHovering("")}}
            extra={<div
                    onClick={(e)=>{
                        console.log(e)
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                        dispatch(setFocusedList(list._id))}}
                    >
                    <IconButton 
                    {...bindTrigger(popupState)}
                    >                                      
                        <MoreVertOutlined/>
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={()=>{ popupState.close()
                            setEditingList(list._id)
                        }}><EditOutlined style={{marginRight:"1rem"}}/> Edit List Name</MenuItem>
                        <MenuItem onClick={()=>{ popupState.close()
                            dispatch(setModal({deletingList:true}))
                        }}><DeleteOutlined style={{marginRight:"1rem"}}/> Delete List</MenuItem>
                    </Menu>
            </div>}
        />
    </div>
     );
}

export default ListCard;