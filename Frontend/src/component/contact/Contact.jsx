import React, { useEffect, useState } from 'react';
import './Contact.css';
import axios from 'axios';

function Contact({ name, phone, id, length, setSelectedContact, selectedContact, setFriendName, setFriendImage, setFriendSocketId, setFriendPhoneNumber, setPrevMessageArray, setUserPhoneNumber, scrollToBottom }) {       //getting name and phone number as a prop

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

    // function which change friend image and friend name when that friend's tab is selected
    const switchingFriend = async () => {
        setFriendName(name ? name : phone);
        setFriendImage(avatar);
        const friendSocketID = await axios.post('http://localhost:3000/api/friendSocketId', {
            phone: phone
        })
        setFriendSocketId(friendSocketID.data.friendSocketId);
        setFriendPhoneNumber(phone)
        setTimeout(scrollToBottom, 100);
    }

    //function which is used to load messages stored in db according to friend phone number
    const loadMessages = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/token_data', { withCredentials: true });
            const userPhone = response.data.account.phone_no;
            const friendPhone = phone;
            const messages = await axios.post('http://localhost:3000/api/chatFetch', {
                userPhone: userPhone,
                friendPhone: friendPhone
            });
            setUserPhoneNumber(userPhone)
            console.log(messages.data.data);
            setPrevMessageArray(messages.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`Contact_main_div ${id === selectedContact ? 'selected' : ''}`} id={id} onClick={() => { setSelectedContact(id); switchingFriend(); loadMessages() }}>
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
