import React, { useState } from 'react';
import './Profile.css';
import logo from '../assets/logo.png';
import axios from 'axios';


function Profile() {

    const [bio, setBio] = useState(''); // state to store bio
    const [imageFile, setImageFile] = useState(null); // state for image

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

    const onChange = (e) => {
        setBio(e.target.value);
    }

    const handleProfile = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setImageFile('https://react.semantic-ui.com/images/wireframe/square-image.png');
        }

        try {
            const response = await axios.post('http://localhost:3000/api/profile', {
                avatar: image,
                bio: bio
            }, { withCredentials: true });// This allows cookies to be sent with the request
            alert(response.data.message);
        } catch (error) {
            console.log("Error while creating profile:", error);
        }
    }

    return (
        <>
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
                        <div class="field" style={{ textAlign: 'center' }}>
                            <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInputChange} />
                            <div onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDrop} style={{
                                display: 'inline-block', borderRadius: '50%', overflow: 'hidden', width: '300px', height: '300px', cursor: 'pointer',
                            }}>
                                <img src={image} className="ui avatar medium image" alt="Profile" style={{ objectFit: 'cover', }} />
                            </div>
                        </div>
                        <div class="field">
                            <textarea required style={{ resize: 'none' }} name="bio" rows="4" cols="50" maxLength="200" placeholder='Tell about yourself in 200 characters or less...' onChange={onChange} value={bio} />
                        </div>

                        <button class="ui fluid button login_submit" type="submit">Create Profile</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile
