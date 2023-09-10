import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Input } from "antd";
import axios from 'axios';
import { useState } from "react";
import history from '../App/history';

function Login() {
    const [user, setUser] = useState({username:"",password:""})
    const [form] = Form.useForm();

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
                console.log(e)
            })
    }

    return (
        <div className="landing-form-container" >
            <header className='landing-header'><h1>Login</h1></header>
            <Form
                form={form}
                className='landing-form'
                onFinish={handleSubmit}
            >
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