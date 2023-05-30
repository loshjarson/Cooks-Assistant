import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Input } from "antd";
import axios from 'axios';
import { useState } from "react";
import history from '../history';

function Signup() {
    const [user, setUser] = useState({username:"",password:""})
    const [form] = Form.useForm();

    const handleChange = (e) => {
        const {id, value} = e.target
        console.log(id,value)
        setUser({...user, [id]:value})
    }

    const handleSubmit = () => {
          axios.post("http://localhost:8000/auth/register", user)
            .then(res => {
                console.log(res.data.message)
                sessionStorage.setItem("token",res.data.token)
                sessionStorage.setItem("userId", res.data.id)
                history.push("/home")
                history.go("/home")
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <div style={{textAlign:"center"}}>
            <header style={{textAlign:"center", borderBottom:"1px solid grey", margin:"0 10px"}}><h1>Signup</h1></header>
            <Form
                form={form}
                style={{margin:"25px"}}
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
                <Form.Item
                    name={"confirmPassword"}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                    dependencies={['password']}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder='confirm password'/>
                </Form.Item>
                <Form.Item>
                   <Button variant="outlined" htmlType='submit'>Submit</Button> 
                </Form.Item>
            </Form>
            
        </div>
    );
}

export default Signup;