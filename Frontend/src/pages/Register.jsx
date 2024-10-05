import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Register.css';
import axios from 'axios';
import validator from 'validator';
import Loader from '../component/loader/Loader';
import MultiFuncModal from '../component/modal/MultiFuncModal';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    // state for loader
    const [displayLoader, setDisplayLoader] = useState(false)

    //state for email
    const [emailError, setEmailError] = useState("");
    //state for password
    const [passwordError, setPasswordError] = useState("");
    //state for phone number
    const [phoneError, setPhoneError] = useState("");

    //state to store response message
    const [responseMessage, setResponseMessage] = useState("");
    //  State for modal open and close
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState(null);

    //funtion to validate email
    const checkEmail = (email) => {
        if (!validator.isEmail(email))
            setEmailError('Enter a valid email');
        else
            setEmailError('');
    }

    //funtion to validate password
    const checkPassword = (password) => {
        if (password.length < 8)
            setPasswordError("Password must be at least 8 characters long.");
        else if (!/[a-z]/.test(password))
            setPasswordError("Password must contain at least one lowercase letter.");
        else if (!/[A-Z]/.test(password))
            setPasswordError("Password must contain at least one uppercase letter.");
        else if (!/\d/.test(password))
            setPasswordError("Password must contain at least one digit.");
        else if (!/[@$!%*?&]/.test(password))
            setPasswordError("Password must contain at least one special character.");
        else
            setPasswordError("");

    }

    //funtion to validate phone number
    const checkPhone = (phone) => {
        if (!validator.isNumeric(phone))
            setPhoneError("Phone number must contain only numbers.");
        else if (phone.length > 10)
            setPhoneError("Phone number must not exceed 10 digits.");
        else if (phone.length < 10)
            setPhoneError("Phone number must be exactly 10 digits.");
        else
            setPhoneError("");
    }

    // state for form credentials
    const [cred, setCred] = useState({ name: "", email: "", password: "", phone_no: "" });
    // function for form credential change
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    //funtion to handle registration
    const handleRegister = async (e) => {
        //preventing default nation of form submission
        e.preventDefault();

        // calling email validation function
        checkEmail(cred.email);
        //  calling phone number validation function
        checkPhone(cred.phone_no);
        // calling password validation function
        checkPassword(cred.password);

        // if find error than return nothing
        if (emailError !== "" || passwordError !== "" || phoneError !== "") {
            return; // Prevent submission if there are errors
        }

        //if no error the start loader for processing
        setDisplayLoader(true)

        // calling api for registration
        try {
            const response = await axios.post(`http://localhost:3000/api/register`, {
                name: cred.name,
                email: cred.email,
                password: cred.password,
                phone_no: cred.phone_no
            });
            //Setting the response message for modal
            setResponseMessage(response.data.message)
            setStatus(response.data.status)
            //opening the modal
            setModalOpen(true);

        } catch (error) {
            // consoling the error
            console.log('Error while registering', error);
        }
        finally {
            // removing loader after processing
            setDisplayLoader(false);

        }
    }

    const login = () => {
        navigate('/login')
    }
    return (
        <div style={{ backgroundColor: '#f6f6ff', minHeight: '100vh' }}>
            <div className={`register_loader ${displayLoader ? 'register_loader1' : ''}`}>
                <Loader></Loader>
            </div>
            <MultiFuncModal status={status} page={'register'} state={setModalOpen} opening={modalOpen} body={responseMessage} type='message' trigger={<div />}></MultiFuncModal>
            <div className="Register_header">
                <div class="ui huge header Register_logo">
                    <div>
                        <img src={logo} class="ui avatar image" />
                    </div>
                    <div className='Register_header_content'>Register</div>
                    <div className='Register_header_content'>Get your GoTalk account now.</div>
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
                            <div className='Register_error'>{emailError}</div>
                        </div>
                        <div class="field">
                            <label>Phone Number</label>
                            <input required name='phone_no' type='text' placeholder="Phone No" onChange={onChange} />
                            <div className='Register_error'>{phoneError}</div>
                        </div>
                        <div class="field">
                            <label>Password</label>
                            <input required name='password' type='password' placeholder="Password" onChange={onChange} />
                            <div className='Register_error'>{passwordError}</div>
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
                    <h5 class='ui header'>Already have a account? <span className='Register_footer_span' onClick={login}>Sign in</span></h5>
                </div>
            </div>
        </div>
    )
}

export default Register
