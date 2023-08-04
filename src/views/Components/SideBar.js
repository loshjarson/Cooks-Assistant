import React from 'react';
import { Drawer } from '@mui/material';


function SideBar({open}) {

    
    return ( 
        <Drawer 
        variant='permanent'
        anchor="right"
        sx={{
            margin: "auto",
            [`& .MuiDrawer-paper`]: {top:"auto", width:open ? "15vw": "0", transition:"width 300ms ease-in-out 100ms"},
        }}
        >

        </Drawer> 
    );
}

export default SideBar;