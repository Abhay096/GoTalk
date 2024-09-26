import React, { useEffect, useState } from 'react';
import './Chat.css';
import Contact from '../component/contact/Contact';
import ModalExampleCloseIcon from '../component/modal/ModalExampleCloseIcon';
import axios from 'axios';

function Chat() {
    const [userProfileImage, setUserProfileImage] = useState('');
    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await axios.get('http://localhost:3000/api/profile_fetch', { withCredentials: true });
                const user_Profile = profile.data.userProfile;
                setUserProfileImage(user_Profile.avatar);
            } catch (error) {
                console.log("Error while fetching user profile data", error);
            }
        }
        loadData();
    }, []);
    return (
        <div className='Chat_main_div'>
            <div className='Chat_contact'>
                <div className="Chat_contact_header">
                    <h2 class="ui header Chat_contact_header_chat">Chats</h2>
                    <ModalExampleCloseIcon></ModalExampleCloseIcon>
                </div>
                <div className="Chat_contact_search">
                    <input className='Chat_contact_search_input' type="search" name="" id="" placeholder='Search...' />
                </div>
                <div className='Chat_contact_contact'>
                    <Contact></Contact>
                    <Contact></Contact>

                </div>
                <div className='Chat_contact_footer'>
                    <div className='Chat_contact_footer_avatar_div'><img src={userProfileImage} class="ui avatar image" /></div>
                    <div><i aria-hidden="true" class="setting large fitted icon"></i></div>
                </div>
            </div>
            <div className='Chat_message'>j</div>
        </div>
    )
}

export default Chat
