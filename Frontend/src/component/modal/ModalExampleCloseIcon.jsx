import React, { useState } from 'react';
import './ModalExampleCloseIcon.css';
import validator from 'validator';
import axios from 'axios';

import {
    ModalContent,
    ModalActions,
    Button,
    Header,
    Icon,
    Modal,
} from 'semantic-ui-react'

function ModalExampleCloseIcon() {
    const [open, setOpen] = React.useState(false)

    const [phoneError, setPhoneError] = useState("");
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
    const [cred, setCred] = useState({ password: "", phone_no: "" });
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        checkPhone(cred.phone_no);

        if (phoneError !== "") {
            return; // Prevent submission if there are errors
        }

        try {
            const response = await fetch(`http://apilayer.net/api/validate?access_key=ddf70180115d1103a1491ad99d8cf5ea&number=${Number(cred.phone_no)}&country_code=IN`);
            const data = await response.json()
            console.log(data);
        } catch (error) {
            console.log('Error while Checking existance of phone number:', error);

        }

        setOpen(false);
    }


    return (
        <Modal
            size='tiny'
            closeIcon
            open={open}
            trigger={<i aria-hidden="true" style={{ cursor: 'pointer' }} class="plus large icon"></i>}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
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
                                <input required name='phone_no' type='text' placeholder="Phone No" onChange={onChange} />
                                <div className='login_error'>{phoneError}</div>
                            </div>
                            <button class="ui fluid button login_submit" type="submit">Sign in</button>
                        </form>
                    </div>
                </div>
            </ModalContent>

        </Modal>
    )
}

export default ModalExampleCloseIcon