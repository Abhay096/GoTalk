import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Register.css';

function Register() {

    const [cred, setCred] = useState({ name: "", email: "", password: "", phone: "" });
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }
    const handleRegister = async (e) => {
        e.preventDefault();
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
                            <input name='name' type='text' placeholder="Name" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Email</label>
                            <input name='email' type='text' placeholder="Email" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Phone Number</label>
                            <input name='phone' type='text' placeholder="Phone No" onChange={onChange} />
                        </div>
                        <div class="field">
                            <label>Password</label>
                            <input name='password' type='password' placeholder="Password" onChange={onChange} />

                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" class="hidden" readonly="" tabindex="0" />
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
