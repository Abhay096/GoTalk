import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Register.css';
import axios from 'axios';


function Register() {

    const [cred, setCred] = useState({ name: "", email: "", password: "", phone_no: "" });
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            axios.post(`http://localhost:3000/api/register`, {
                name: cred.name,
                email: cred.email,
                password: cred.password,
                phone_no: cred.phone_no
            }).then(function (response) {
                console.log(response);
                alert(response.data.message)
            }).catch(function (error) {
                console.log('Server Error while registering', error);
            })
        } catch (error) {
            console.log('Error while registering', error);
        }
    }
    return (
        <>
            <div className="Register_header">
                <div class="ui huge header Register_logo">
                    <div>
                        <img src={logo} class="ui avatar image" />
                    </div>
                    <div className='Register_header_content'>Register</div>
                    <div className='Register_header_content'>Get your GoTalk account now</div>
                </div>
            </div>
            <div className="Register_form_outer_div">
                <div className="Register_form_inner_div">
                    <form onSubmit={handleRegister} class="ui form Register_form">
                        <div class="field">
                            <label>Name</label>
                            <input required name='name' type='text' placeholder="Name" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Email</label>
                            <input required name='email' type='text' placeholder="Email" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Phone Number</label>
                            <input required name='phone_no' type='text' placeholder="Phone No" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Password</label>
                            <input required name='password' type='password' placeholder="Password" onChange={onChange} />

                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input required type="checkbox" readonly="" tabindex="0" />
                                <label>I agree to the Terms and Conditions</label>
                            </div>
                        </div>
                        <button class="ui fluid button Register_submit" type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <div className="Register_footer">
                <div class="ui huge header" style={{ "width": "100%" }}>
                    <h5 class='ui header'>Already have a account? <span className='Register_footer_span'>Sign in</span></h5>
                </div>
            </div>
        </>
    )
}

export default Register
