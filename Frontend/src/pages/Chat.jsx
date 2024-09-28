import React, { useEffect, useState } from 'react';
import './Chat.css';
import Contact from '../component/contact/Contact';
import ModalExampleCloseIcon from '../component/modal/ModalExampleCloseIcon';
import axios from 'axios';
import Popover from '../component/popover/Popover';
import MultiFuncModal from '../component/modal/MultiFuncModal';
import defimg from '../assets/defimg.jpg';
import Sender from '../component/sender_message/Sender';
import Receiver from '../component/receiver_message/Receiver';

function Chat() {
    //state to store user profile image
    const [userProfileImage, setUserProfileImage] = useState('');
    // state to store array of connections
    const [connectionArray, setConnectionArray] = useState([]);
    // checking if multifuncmodel is open or closed
    const [modalOpen, setModalOpen] = useState(false);
    // state for length of the array
    const [length, setLength] = useState(0);
    // state to change the style of contact tab to know user is chatting with whom
    const [selectedContact, setSelectedContact] = useState(null);



    //function to fetch profiles data and connection array
    const loadData = async () => {
        try {
            const profile = await axios.post('http://localhost:3000/api/profile_fetch', {}, { withCredentials: true });
            const user_Profile = profile.data.userProfile;
            //setting the message for modal
            setUserProfileImage(user_Profile.avatar);
            //opening the modal
            setModalOpen(false);
        } catch (error) {
            console.log("Error while fetching user profile data", error);
        }

        try {
            const response = await axios.get('http://localhost:3000/api/connectionFetch', {
                withCredentials: true
            });
            setConnectionArray(response.data.connections.connection);
            setLength(response.data.connections.connection.length);
        } catch (error) {
            console.log("Error while fetching connections", error);
        }
    }

    //hook which render automatically when page first render and call the function
    useEffect(() => {
        loadData();
    }, []);

    //hook to load data every time after updating the madal by closing the modal
    useEffect(() => {
        if (modalOpen)
            loadData();
    }, [modalOpen]);
    return (
        <div className='Chat_main_div'>
            <div className='Chat_contact'>
                <div className="Chat_contact_header">
                    <h2 class="ui header Chat_contact_header_chat">Chats</h2>
                    <ModalExampleCloseIcon trigger={<div>
                        <Popover trigger={<i aria-hidden="true" style={{ cursor: 'pointer' }} class="plus large icon"></i>} content="Add user"></Popover>
                    </div>} onClose={loadData}></ModalExampleCloseIcon>
                </div>
                <div className="Chat_contact_search">
                    <input className='Chat_contact_search_input' type="search" name="" id="" placeholder='Search...' />
                </div>
                <div className='Chat_contact_contact'>
                    {connectionArray.map((connection, index) => (
                        <Contact length={length} id={index} key={index} name={connection.value} phone={connection.key} setSelectedContact={setSelectedContact}
                            selectedContact={selectedContact} />
                    ))}

                </div>
                <div className='Chat_contact_footer'>
                    <div className='Chat_contact_footer_avatar_div'>
                        <MultiFuncModal state={setModalOpen} type={'profile'} trigger={<div>
                            <Popover trigger={<img style={{ cursor: 'pointer' }} src={userProfileImage} class="ui avatar image" />} content="Your Profile"></Popover>
                        </div>} />
                    </div>
                    <div>
                        <Popover trigger={<i style={{ cursor: 'pointer' }} aria-hidden="true" class="setting large fitted icon"></i>} content="Settings"></Popover>
                    </div>
                </div>
            </div>



            <div className='Chat_message'>
                <div className="Chat_message_profile_header">
                    <img src={defimg} className="ui mini avatar image Chat_message_profile_header_image" />
                    <h3 className='Chat_message_profile_header_name'>Abhishek thakur</h3>
                </div>
                <div className="Chat_message_display">
                    <Sender></Sender>
                    <Receiver></Receiver>
                </div>
                <div className="Chat_message_footer">
                    <form class="ui form Chat_message_footer_form">
                        <input className='Chat_message_footer_form_input' placeholder="Enter message..." />
                        <button class="ui button Chat_message_footer_form_button" type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat
