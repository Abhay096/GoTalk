import React, { useState } from 'react';
import './Profile.css';
import logo from '../assets/logo.png';
import axios from 'axios';
import Loader from '../component/loader/Loader';
import MultiFuncModal from '../component/modal/MultiFuncModal';

function Profile() {

    // State for loader
    const [displayLoader, setDisplayLoader] = useState(false);
    // state to store bio
    const [bio, setBio] = useState('');
    // state for image
    const [imageFile, setImageFile] = useState(null);
    //state to store response message
    const [responseMessage, setResponseMessage] = useState("");
    //  State for modal open and close
    const [modalOpen, setModalOpen] = useState(false);

    // ********************handle upload, drag and drop functionality********************
    const [image, setImage] = useState('https://react.semantic-ui.com/images/wireframe/square-image.png');

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
    //********************End of upload drag and drop functionality********************

    //function to handle text area input
    const onChange = (e) => {
        setBio(e.target.value);
    }

    // function to handle submission of profile data
    const handleProfile = async (e) => {
        //preventing default nature of form submission 
        e.preventDefault();

        //if dont get the image then send the default image
        if (!imageFile) {
            setImageFile('https://react.semantic-ui.com/images/wireframe/square-image.png');
        }

        // start loader for processing
        setDisplayLoader(true)

        //  api call for profile data submission
        try {
            const response = await axios.post('http://localhost:3000/api/profile', {
                avatar: image,
                bio: bio
            }, { withCredentials: true });// This allows cookies to be sent with the request
            //setting the response for modal
            setResponseMessage(response.data.message)
            //opening the modal
            setModalOpen(true);
        } catch (error) {
            console.log("Error while creating profile:", error);
        }
        finally {
            // remove loader after successful profile submission or error
            setDisplayLoader(false);
        }
    }

    return (
        <>
            <div className={`profile_loader ${displayLoader ? 'profile_loader1' : ''}`}>
                <Loader></Loader>
            </div>
            <MultiFuncModal state={setModalOpen} opening={modalOpen} body={responseMessage} type='message' trigger={<div />}></MultiFuncModal>
            <div className="login_header">
                <div class="ui huge header login_logo">
                    <div>
                        <img src={logo} class="ui avatar image" />
                    </div>
                    <div className='login_header_content'>Profile</div>
                    <div className='login_header_content'>Create your profile.</div>
                </div>
            </div>
            <div className="Profile_form_outer_div">
                <div className="login_form_inner_div">
                    <form onSubmit={handleProfile} class="ui form login_form">
                        <div class="field" className='Profile_image_outer_div'>
                            <input className='Profile_image_input' id="fileInput" type="file" accept="image/*" onChange={handleFileInputChange} />
                            <div className='Profile_image_inner_div' onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDrop}>
                                <img src={image} className="ui avatar medium image Profile_image_img" alt="Profile" />
                            </div>
                        </div>
                        <div class="field">
                            <textarea className='Profile_textarea' required name="bio" rows="4" cols="50" maxLength="200" placeholder='Tell about yourself in 200 characters or less...' onChange={onChange} value={bio} />
                        </div>

                        <button class="ui fluid button login_submit" type="submit">Create Profile</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile
