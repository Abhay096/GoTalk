import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png'
import './Contact.css'
import defimg from '../../assets/defimg.jpg'
import axios from 'axios'

function Contact({ name, phone }) {
    const [avatar, setAvatar] = useState('');
    useEffect(() => {
        const friendprofile = async () => {
            const profile = await axios.post('http://localhost:3000/api/profile_fetch', {
                phone: phone
            }, { withCredentials: true });
            setAvatar(profile.data.userProfile.avatar);
        }
        friendprofile();
    }, []);
    return (
        <div className='Contact_main_div'>
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
