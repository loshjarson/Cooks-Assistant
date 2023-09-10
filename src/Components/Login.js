import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Input, Alert } from "antd";
import axios from 'axios';
import { useState } from "react";
import history from '../App/history';
import { Typography } from '@mui/material';

function Login() {
    const [user, setUser] = useState({username:"",password:""})
    const [error, setError] = useState(false)
    const [form] = Form.useForm();

    const handleClose = () => {
        setError(false)
    }


    const handleChange = (e) => {
        const {id, value} = e.target
        setUser({...user, [id]:value})
    }

    const handleSubmit = () => {
          axios.post("https://cooksassistant-4e729736581a.herokuapp.com/auth/login", user)
            .then(res => {
                sessionStorage.setItem("token",res.data.token)
                sessionStorage.setItem("userId", res.data.userID)
                history.push("/home")
                history.go("/home")
            })
            .catch(e => {
                setError(true)
                console.log(e)
            })
    }

    return (
        <div className="landing-form-container" >
            <header className='landing-header'><Typography variant='h3'>Login</Typography></header>
            <Form
                form={form}
                className='landing-form'
                onFinish={handleSubmit}
            >
                {error && (<Alert message="Username or password is incorrect" type="error" closable afterClose={handleClose} style={{margin:"10px"}}/>)}
                <Form.Item
                    name={"username"}
                    rules={[{
                        required: true,
                        message: 'A username is required'
                    }]}
                >
                    <Input prefix={<UserOutlined/>} placeholder='username' onChange={handleChange}/>
                </Form.Item>
                <Form.Item
                    name={"password"}
                    rules={[{
                        required: true,
                        message: 'A password is required'
                    }]}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder='password' onChange={handleChange}/>
                </Form.Item>
                <Form.Item>
                  <Button variant="outlined" htmlType='submit'>Submit</Button>  
                </Form.Item>
            </Form>
            
        </div>
    );
}
 
export default Login;