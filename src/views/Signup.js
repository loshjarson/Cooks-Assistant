import { Box, InputLabel, OutlinedInput, FormControl, Button } from "@mui/material";
import { Col, Row } from "antd";
import { useState } from "react";

function Signup() {
    const [user, setUser] = useState({username:"",password:"",confirmPassword:""})
    return (
        <div style={{textAlign:"center"}}>
            <header style={{textAlign:"center", borderBottom:"1px solid grey", margin:"0 10px"}}><h1>Signup</h1></header>
            <Box component="form" noValidate margin="25px">
                <Row gutter={[16,16]}>
                    <Col span={23} justify="center">
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <OutlinedInput
                                required
                                id="username"
                                label="Username"
                                onChange={(e)=>setUser({...user,username:e.target.value})}
                            />
                        </FormControl>
                    </Col>                    
                    <Col span={23} justify="center">
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                required
                                type="password"
                                id="password"
                                label="Password"
                                onChange={(e)=>setUser({...user,password:e.target.value})}
                            />
                        </FormControl>
                    </Col>
                    <Col span={23} justify="center">
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                required
                                id="confirm-password"
                                label="Confirm Password"
                                onChange={(e)=>setUser({...user,confirmPassword:e.target.value})}
                            />
                        </FormControl>
                    </Col>
                </Row>
            </Box>
            <Button variant="outlined">Login</Button>
        </div>
    );
}

export default Signup;