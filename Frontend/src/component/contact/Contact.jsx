import React, { useEffect, useState } from 'react';
import './Contact.css';
import axios from 'axios';

function Contact({ name, phone, id, length, setSelectedContact, selectedContact, setFriendName, setFriendImage, setFriendSocketId, setFriendPhoneNumber, setPrevMessageArray, setUserPhoneNumber, scrollToBottom, setChatWindowCss, handleContactClick, latest, latestTime }) {       //getting name and phone number as a prop

    // state to store user profile image
    const [avatar, setAvatar] = useState('');
    //state to store last message of chat

    // hook which run when it render first time
    useEffect(() => {

        // function to get user profile image
        const friendprofile = async () => {
            const profile = await axios.post('https://gotalk-backend.onrender.com/api/profile_fetch', {
                phone: phone
            }, { withCredentials: true });
            setAvatar(profile.data.userProfile.avatar);
        }
        // calling the function
        friendprofile();
    }, []);

    // function which change friend image and friend name when that friend's tab is selected
    const switchingFriend = async () => {
        setFriendName(name ? name : phone);
        setFriendImage(avatar);
        const friendSocketID = await axios.post('https://gotalk-backend.onrender.com/api/friendSocketId', {
            phone: phone
        })
        setFriendSocketId(friendSocketID.data.friendSocketId);
        setFriendPhoneNumber(phone)
        setTimeout(scrollToBottom, 100);
    }

    //function which is used to load messages stored in db according to friend phone number
    const loadMessages = async () => {
        try {
            setPrevMessageArray([]);
            const response = await axios.get('https://gotalk-backend.onrender.com/api/token_data', { withCredentials: true });
            const userPhone = response.data.account.phone_no;
            const friendPhone = phone;
            const messages = await axios.post('https://gotalk-backend.onrender.com/api/chatFetch', {
                userPhone: userPhone,
                friendPhone: friendPhone
            });
            setUserPhoneNumber(userPhone)
            setPrevMessageArray(messages.data.data);
            setChatWindowCss(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`Contact_main_div ${id === selectedContact ? 'selected' : ''}`} id={id} onClick={() => { setSelectedContact(id); switchingFriend(); loadMessages(); handleContactClick() }}>
            <div className='Contact_image_div'>
                <img src={avatar} className="ui avatar image Contact_image" />
            </div>
            <div className='Contact_name_div'>
                <div style={{ fontWeight: 'bold' }}>{name ? name : '+91 ' + phone}</div>
                <div>{latest}</div>
            </div>
            <div className='Contact_time_div'>{latestTime}</div>
        </div>
    )
}

export default Contact
