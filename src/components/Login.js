import React, { useState } from 'react';
import '../styles/Login.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


import { ReactComponent as UpperCurl } from '../assets/login_upper_curl.svg';
import { ReactComponent as LowerCircle } from '../assets/login_lower_circle.svg';
import { ReactComponent as LoginElephant } from '../assets/login_elephant.svg';
import { ReactComponent as LoginUser } from '../assets/login_user.svg';
import { ReactComponent as LoginLock } from '../assets/login_lock.svg';


document.body.style.overflow = "hidden"

const Login = () => {
    const baseUrl = "https://asset-tracking-portal.herokuapp.com";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();

    const LoginClicked = () => {

        axios.post(baseUrl + "/login", { "username": username, "password": password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {

                const cookies = new Cookies();
                cookies.set('jwt', res.data.jwt, { path: '/' });
                navigate('/Map', { state: { jwtToken: res.data.jwt } });

            }).catch(error => {

                toast.error("Access Denied", { autoClose: 3000 })
            })


    }


    return (
        <>

            <div className='login_outer'>
                <UpperCurl style={{
                    width: '70%',
                    height: '70%',
                    position: 'relative',
                    float: 'right',
                    marginRight: '-20%'
                }} />


                <LowerCircle style={{

                    width: '40%',
                    height: '40%',
                    position: 'absolute',
                    bottom: '0',
                    marginLeft: "-10%"
                }} />
                <LoginElephant style={{
                    position: 'fixed',
                    width: '12%',
                    height: '18%',
                    marginLeft: '40%',
                    marginTop: '6%'


                }} />

                <div className='User_Auth_Form'>
                    <div className='user_name  login_box'>
                        <LoginUser style={{
                            width: '70%',
                            height: '70%',
                            position: 'absolute',
                            marginTop: '2%',
                            marginLeft: '-28%'

                        }} />
                        <input
                            visibility
                            type="text"
                            style={{
                                position: 'absolute',
                                marginLeft: '15%',
                                width: '80%',
                                height: '80%',
                                marginTop: '1%'

                            }} placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
                    </div>





                    <div className='user_password login_box'>
                        <LoginLock style={{
                            width: '70%',
                            height: '70%',
                            position: 'absolute',
                            marginTop: '2%',
                            marginLeft: '-28%'

                        }} />
                        <input type="password"
                            style={{
                                position: 'absolute',
                                marginLeft: '15%',
                                width: '80%',
                                height: '80%',
                                marginTop: '1%'
                            }} placeholder="Password" onChange={(event) => setPassword(event.target.value)} />

                    </div>
                    <ToastContainer />
                    <button className='login_box' style={{
                        position: 'absolute',
                        width: '55%',
                        height: '10%',
                        marginLeft: '23%',
                        marginTop: '30%',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px'


                    }} onClick={LoginClicked}>Login</button><br /><br />
                    <Link className="forgot_password login_box" to={'/#'}>Forgot Password?</Link>
                    <Link to={'/Signup'}>

                        <button className='login_box' style={{
                            position: 'absolute',
                            width: '55%',
                            height: '10%',
                            marginLeft: '23%',
                            marginTop: '40%',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px'


                        }} >Register</button></Link>


                </div>



            </div >

        </>

    );
}

export default Login;