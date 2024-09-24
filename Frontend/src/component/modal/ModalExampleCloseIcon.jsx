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
    const [cred, setCred] = useState({ name: "", friendPhone: "" });
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        checkPhone(cred.friendPhone);

        if (phoneError !== "") {
            return; // Prevent submission if there are errors
        }
        try {
            const response = await axios(`http://apilayer.net/api/validate?access_key=ddf70180115d1103a1491ad99d8cf5ea&number=${Number(cred.friendPhone)}&country_code=IN`);
            console.log(response);
            const data = await response.json()
            if (data.valid === false) {
                alert("Phone number doesn't exist");
                return;
            }


            try {
                const response = await axios.get('http://localhost:3000/api/token_data', {
                    withCredentials: true // This allows cookies to be sent with the request
                });
                alert(response.message);
                const userPhone = response.data.phone;

                try {
                    const user = await axios.patch('http://localhost:3000/api/connectionRequest', {
                        name: cred.name,
                        friendPhone: cred.friendPhone,
                        userPhone: userPhone
                    });
                    alert(user.message);
                } catch (error) {
                    console.log('Error while adding user:', error);
                }

            } catch (error) {
                console.log('Error while getting token:', error);
            }


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