import React, { useState } from 'react';
import { Divider, Drawer } from '@mui/material';
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import history from '../../history';




function SideBar({open, lists, setLists, setFocusedList}) {
    const [showConfirmation, setShowConfirmation] = useState(false)

    const logout = () => {
        sessionStorage.clear()
        history.push("/")
        history.go("/")
        setShowConfirmation(false)
    }
    
    return ( 
        <Drawer 
        variant='permanent'
        anchor="right"
        sx={{
            margin: "auto",
            [`& .MuiDrawer-paper`]: {top:"auto", width:open ? "15vw": "0", transition:"width 300ms ease-in-out 100ms"},
        }}
        >
            <div>
                {lists.map(list => {
                    return(
                        <Button
                            id={list._id}
                            className='list'
                            style={{width:"100%", height:"4rem"}}
                        >
                            {list.name}
                        </Button>
                    )
                })}
            </div>
            <div 
            id='account-actions'
            style={{margin:"auto 0 4rem 0"}}
            >
                <Divider/>
                <Button icon={<LogoutOutlined/>} type="text" style={{width:"100%"}} onClick={() => setShowConfirmation(true)}>Logout</Button>
                <Modal open={showConfirmation} onCancel={()=>setShowConfirmation(false)} title="Logout?" okText="Logout" cancelText="Nevermind" onOk={()=>logout()}><p>Are you sure you want to logout</p></Modal>
            </div>
        </Drawer> 
    );
}

export default SideBar;