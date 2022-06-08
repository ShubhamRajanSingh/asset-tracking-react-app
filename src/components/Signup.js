import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Signup.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { ReactComponent as UpperCurl } from '../assets/login_upper_curl.svg';
import { ReactComponent as LowerCircle } from '../assets/login_lower_circle.svg';
import { ReactComponent as LoginElephant } from '../assets/login_elephant.svg';
import { ReactComponent as LoginUser } from '../assets/login_user.svg';
import { ReactComponent as LoginLock } from '../assets/login_lock.svg';
import { ReactComponent as Email } from '../assets/signup_email_svg.svg';



const Signup = () => {
    const baseUrl = "https://asset-tracking-portal.herokuapp.com";
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const CreateAccountClicked = () => {

        if (password === confirmPass) {
            if (username !== "" && email !== "" && password !== "" && username !== null && email !== "null" && password !== null) {
                axios.post(baseUrl + "/signup", {
                    "username": username,
                    "email": email,
                    "password": password
                },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        toast.success("Account Created", { autoClose: 3000 })

                    }).catch(error => {

                        toast.error(error.response.data, { autoClose: 3000 })
                    })
            } else {
                toast.error("Account Not Created", { autoClose: 3000 })

            }
        } else {

            toast.error("Password and Confirm Password do not Match", { autoClose: 3000 })
        }



    }

    return (
        <div className='signup_outer'>
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
                marginTop: '3%'
            }} />
            <div className='User_Signup_Form'>
                <div className='signup_user_name  signup_box'>
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
                <div className='signup_user_email  signup_box'>
                    <Email style={{
                        width: '70%',
                        height: '70%',
                        position: 'absolute',
                        marginTop: '2%',
                        marginLeft: '-28%'
                    }} />
                    <input
                        visibility
                        type="email"
                        style={{
                            position: 'absolute',
                            marginLeft: '15%',
                            width: '80%',
                            height: '80%',
                            marginTop: '1%'

                        }} placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className='signup_user_password signup_box'>
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
                <div className='confirm_user_password signup_box'>
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
                        }} placeholder="Confirm Password" onChange={(event) => setConfirmPass(event.target.value)} />
                </div>
                <ToastContainer />
                <button className='signup_box' style={{
                    position: 'absolute',
                    width: '55%',
                    height: '10%',
                    marginLeft: '23%',
                    marginTop: '56%',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                }} onClick={CreateAccountClicked}>Create Account</button><br /><br />
                <Link className="already_account signup_box" to={'/Login'}>Already have an Account?</Link>
            </div>
        </div >

    );


}

export default Signup;