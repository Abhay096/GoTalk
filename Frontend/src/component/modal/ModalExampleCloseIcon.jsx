import React, { useState } from 'react';
import './ModalExampleCloseIcon.css';
import validator from 'validator';
import axios from 'axios';
import Loader from '../loader/Loader';
import MultiFuncModal from './MultiFuncModal';

import { ModalContent, ModalActions, Button, Header, Icon, Modal, } from 'semantic-ui-react'

function ModalExampleCloseIcon({ onClose, trigger }) { //function passed as a prop

    //state for loader
    const [displayLoader, setDisplayLoader] = useState(false);

    //  State for opening and closing th modal
    const [open, setOpen] = React.useState(false)

    //  State for the phone number validation errors
    const [phoneError, setPhoneError] = useState("");

    //state to store response message
    const [responseMessage, setResponseMessage] = useState("");
    //  State for modal open and close
    const [modalOpen, setModalOpen] = useState(false);

    // Funtion for phone number validation
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

    // State for form data
    const [cred, setCred] = useState({ name: "", friendPhone: "" });

    //  Function to handle form data
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    // Function to handle form submission
    const handleLogin = async (e) => {
        // prevental the default nature of form
        e.preventDefault();

        // calling the function and passing phone number to Validate the phone number
        checkPhone(cred.friendPhone);

        //  if the phone number is not valid then return nothing
        if (phoneError !== "") {
            return;
        }

        // loader for processing the data
        setDisplayLoader(true)

        // try block for checking phone number really exist
        try {
            //  calling the function to check if the phone number exist
            const response = await axios(`http://apilayer.net/api/validate?access_key=ddf70180115d1103a1491ad99d8cf5ea&number=${Number(cred.friendPhone)}&country_code=IN`);
            if (response.data.valid === false) {
                //setting the message for modal
                setResponseMessage("Phone number doesn't exist")
                // opening the modal
                setModalOpen(true);
                return;
            }

            // try block to retrive data in token
            try {
                const response = await axios.get('http://localhost:3000/api/token_data', {
                    withCredentials: true // This allows cookies to be sent with the request
                });
                const userPhone = response.data.account.phone_no;

                // try block to connection user with his/her friend
                try {
                    const user = await axios.patch('http://localhost:3000/api/connectionRequest', {
                        name: cred.name,
                        friendPhone: cred.friendPhone,
                        userPhone: userPhone
                    });
                    // setting the message for modal
                    setResponseMessage(user.data.message)
                    // opening the modal
                    setModalOpen(true);
                } catch (error) {
                    // consoling the error
                    console.log('Error while adding user:', error);
                }

            } catch (error) {
                // consoling the error
                console.log('Error while getting token:', error);
            }
        } catch (error) {
            // consoling the error
            console.log('Error while Checking existance of phone number:', error);
        }

        // remove loader after successful friend connection
        setDisplayLoader(false);
        //closing the modal
        setOpen(false);
        // calling funtion which passed as a prop it is used to render contact everytime when new friend is added
        onClose();
    }

    return (
        <Modal size='tiny' closeIcon open={open} trigger={trigger} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
            <div className={`modal_loader ${displayLoader ? 'modal_loader1' : ''}`}>
                <Loader></Loader>
            </div>
            <MultiFuncModal state={setModalOpen} opening={modalOpen} body={responseMessage} type='message' trigger={<div />}></MultiFuncModal>
            <Header icon='user' content='Add User' />
            <ModalContent>
                <div className="login_form_outer_div">
                    <div className="login_form_inner_div">
                        <form onSubmit={handleLogin} class="ui form add_user_form">
                            <div class="field">
                                <label>Name</label>
                                <input name='name' placeholder="Name" onChange={onChange} />
                            </div>
                            <div class="field">
                                <label>Phone Number</label>
                                <input required name='friendPhone' type='text' placeholder="Phone No" onChange={onChange} />
                                <div className='login_error'>{phoneError}</div>
                            </div>
                            <button class="ui fluid button login_submit" type="submit">Add User</button>
                        </form>
                    </div>
                </div>
            </ModalContent>

        </Modal>
    )
}

export default ModalExampleCloseIcon