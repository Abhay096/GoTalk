import React, { useEffect, useState } from 'react';
import './Contact.css';
import axios from 'axios';

function Contact({ name, phone, id }) {       //getting name and phone number as a prop

    // state to store user profile image
    const [avatar, setAvatar] = useState('');

    // hook which run when it render first time
    useEffect(() => {

        // function to get user profile image
        const friendprofile = async () => {
            const profile = await axios.post('http://localhost:3000/api/profile_fetch', {
                phone: phone
            }, { withCredentials: true });
            setAvatar(profile.data.userProfile.avatar);
        }
        // calling the function
        friendprofile();
    }, []);
    return (
        <div className='Contact_main_div' id={id}>
            <div className='Contact_image_div'>
                <img src={avatar} className="ui avatar image Contact_image" />
            </div>
            <div className='Contact_name_div'>
                <div>{name ? name : phone}</div>
                <div>This is the message</div>
            </div>
            <div className='Contact_time_div'>2:30 PM</div>
        </div>
    )
}

export default Contact
