import React, { useEffect, useState } from 'react';
import './MultiFuncModal.css';
import { ModalContent, ModalActions, Button, Header, Icon, Modal, } from 'semantic-ui-react';
import axios from 'axios';

function MultiFuncModal({ trigger, type, state, body, opening }) {

    // state for modal open or close
    const [open, setOpen] = React.useState(false)
    // state for image file
    const [imageFile, setImageFile] = useState(null);
    // state for user about 
    const [bio, setBio] = useState('')
    // state for user image
    const [image, setImage] = useState('');

    // function to load profile data
    const loadProfile = async () => {
        try {
            const profile = await axios.post('http://localhost:3000/api/profile_fetch', {}, { withCredentials: true });
            const user_Profile = profile.data.userProfile;
            setImage(user_Profile.avatar);
            setBio(user_Profile.about)
        } catch (error) {
            console.log("Error while fetching user profile data", error);
        }
    }

    // calling the loadProfile function every time when modal is opened
    useEffect(() => {
        if (open)
            loadProfile()
    }, [open])

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            previewImage(file);
        }
    };

    const previewImage = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImageFile(file);
            previewImage(file);
        }
    };

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleProfileUpdate = async () => {
        const response = await axios.post('http://localhost:3000/api/profile', {
            avatar: image,
            bio: bio
        }, { withCredentials: true });
        state(true)
        console.log(response.data.message);
    }

    // function to prevent default nature of form
    const preventDefaultForm = (e) => {
        e.preventDefault()
    }

    // function to handle the change event of input fields
    const onChange = (e) => {
        setBio(e.target.value);
    }

    // if modal type is profile then render this modal 
    if (type === 'profile') {
        return (
            <Modal size='tiny' closeIcon open={open} trigger={trigger} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                <Header icon='user circle' content='Update your Profile' />
                <ModalContent>
                    <div className="Profile_form_outer_div">
                        <div className="login_form_inner_div">
                            <form onSubmit={preventDefaultForm} class="ui form MultiFuncModel_profile_form">
                                <div class="field" className='Profile_image_outer_div'>
                                    <input className='Profile_image_input' id="fileInput" type="file" accept="image/*" onChange={handleFileInputChange} />
                                    <div className='MultiFuncModel_Profile_image_inner_div' onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDrop}>
                                        <img src={image} className="ui avatar medium image Profile_image_img" alt="Profile" />
                                    </div>
                                </div>
                                <div class="field">
                                    <textarea className='Profile_textarea' required name="bio" rows="4" cols="50" maxLength="200" placeholder='Tell about yourself in 200 characters or less...' onChange={onChange} value={bio} />
                                </div>
                            </form>
                        </div>
                    </div>
                </ModalContent>
                <ModalActions>
                    <Button color='red' onClick={() => setOpen(false)}>
                        <Icon name='remove' /> No
                    </Button>
                    <Button onClick={() => { handleProfileUpdate(); setOpen(false); }} color='green'>
                        <Icon name='checkmark' /> Yes
                    </Button>
                </ModalActions>
            </Modal>
        )
    }


    // if modal type is message then render this modal
    if (type === 'message') {
        return (
            <Modal
                size='tiny'
                closeIcon
                open={opening}
                trigger={trigger}
                onClose={() => state(false)}
                onOpen={() => state(true)}
            >
                <Header icon='alarm' content='Message' />
                <ModalContent>
                    <h3>{body}</h3>
                </ModalContent>
                <ModalActions>
                    <Button color='green' onClick={() => state(false)}>
                        <Icon name='checkmark' /> Yes
                    </Button>
                </ModalActions>
            </Modal>
        )
    }

}

export default MultiFuncModal
