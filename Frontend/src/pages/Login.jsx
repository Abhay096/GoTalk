import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Login.css';
import axios from 'axios';
import validator from 'validator';
import Loader from '../component/loader/Loader';
import MultiFuncModal from '../component/modal/MultiFuncModal';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    // State for loader
    const [displayLoader, setDisplayLoader] = useState(false);
    // State for phone number validation error
    const [phoneError, setPhoneError] = useState("");
    //state to store response message
    const [responseMessage, setResponseMessage] = useState("");
    //  State for modal open and close
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();


    //funtion for phone validation
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

    // State for form credentials
    const [cred, setCred] = useState({ password: "", phone_no: "" });

    // funtion for form credentials change
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    // function for login
    const handleLogin = async (e) => {
        // preventing default nature of form submission
        e.preventDefault();

        //calling funtion to validate phone number
        checkPhone(cred.phone_no);

        //if  phone number is not valid
        if (phoneError !== "") {
            return; // Prevent submission if there are errors
        }

        // if  phone number is valid then start loader for processing
        setDisplayLoader(true)

        //  api call for login
        try {
            const response = await axios.post(`https://gotalk-backend.onrender.com/api/login`, {
                password: cred.password,
                phone_no: cred.phone_no
            }, {
                withCredentials: true // This will include cookies in the request
            });
            // setting response message
            setResponseMessage(response.data.message)
            setStatus(response.data.status);
            // opeing the modal
            setModalOpen(true);
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.log('Error while login', error);
        }
        finally {
            // remove loader after successful login or error
            setDisplayLoader(false);
        }
    }
    const handleSignUp = () => {
        navigate('/register')
    }
    return (
        <div style={{ backgroundColor: '#f6f6ff', minHeight: '100vh' }}>
            <div className={`login_loader ${displayLoader ? 'login_loader1' : ''}`}>
                <Loader></Loader>
            </div>
            <MultiFuncModal setIsAuthenticated={setIsAuthenticated} page={'login'} status={status} state={setModalOpen} opening={modalOpen} body={responseMessage} type='message' trigger={<div />}></MultiFuncModal>
            <div className="login_header">
                <div class="ui huge header login_logo">
                    <div>
                        <img src={logo} class="ui avatar image" />
                    </div>
                    <div className='login_header_content'>Sign in</div>
                    <div className='login_header_content'>Sign in to continue to GoTalk.</div>
                </div>
            </div>
            <div className="login_form_outer_div">
                <div className="login_form_inner_div">
                    <form onSubmit={handleLogin} class="ui form login_form">
                        <div class="field">
                            <label>Phone Number</label>
                            <input required name='phone_no' type='text' placeholder="Phone No" onChange={onChange} />
                            <div className='login_error'>{phoneError}</div>
                        </div>
                        <div class="field">
                            <label>Password</label>
                            <input required name='password' type='password' placeholder="Password" onChange={onChange} />
                        </div>

                        <button class="ui fluid button login_submit" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
            <div className="login_footer">
                <div class="ui huge header" style={{ "width": "100%" }}>
                    <h5 class='ui header'>Don't have an account? <span className='login_footer_span' onClick={handleSignUp}>Sign up</span></h5>
                </div>
            </div>
        </div>
    )
}

export default Login
