import React, { useEffect, useState } from 'react';
import './Chat.css';
import Contact from '../component/contact/Contact';
import ModalExampleCloseIcon from '../component/modal/ModalExampleCloseIcon';
import axios from 'axios';
import Popover from '../component/popover/Popover';
import MultiFuncModal from '../component/modal/MultiFuncModal';

function Chat() {
    //state to store user profile image
    const [userProfileImage, setUserProfileImage] = useState('');
    // state to store array of connections
    const [connectionArray, setConnectionArray] = useState([]);
    // checking if multifuncmodel is open or closed
    const [modalOpen, setModalOpen] = useState(false);

    //function to fetch profiles data and connection array
    const loadData = async () => {
        try {
            const profile = await axios.post('http://localhost:3000/api/profile_fetch', {}, { withCredentials: true });
            const user_Profile = profile.data.userProfile;
            setUserProfileImage(user_Profile.avatar);
            setModalOpen(false);
        } catch (error) {
            console.log("Error while fetching user profile data", error);
        }

        try {
            const response = await axios.get('http://localhost:3000/api/connectionFetch', {
                withCredentials: true
            });
            setConnectionArray(response.data.connections.connection);
        } catch (error) {
            console.log("Error while fetching connections", error);
        }
    }

    //hook which render automatically when page first render and call the function
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (modalOpen)
            loadData();
    }, [modalOpen]);
    return (
        <div className='Chat_main_div'>
            <div className='Chat_contact'>
                <div className="Chat_contact_header">
                    <h2 class="ui header Chat_contact_header_chat">Chats</h2>
                    <ModalExampleCloseIcon onClose={loadData}></ModalExampleCloseIcon>
                </div>
                <div className="Chat_contact_search">
                    <input className='Chat_contact_search_input' type="search" name="" id="" placeholder='Search...' />
                </div>
                <div className='Chat_contact_contact'>
                    {connectionArray.map((connection, index) => (
                        <Contact key={index} name={connection.value} phone={connection.key} />
                    ))}

                </div>
                <div className='Chat_contact_footer'>
                    <div className='Chat_contact_footer_avatar_div'>
                        <MultiFuncModal state={setModalOpen} type={'profile'} trigger={<div>
                            <Popover trigger={<img src={userProfileImage} class="ui avatar image" />} content="Your Profile"></Popover>
                        </div>} />
                    </div>
                    <div>
                        <Popover trigger={<i aria-hidden="true" class="setting large fitted icon"></i>} content="Settings"></Popover>
                    </div>
                </div>
            </div>
            <div className='Chat_message'>j</div>
        </div>
    )
}

export default Chat
