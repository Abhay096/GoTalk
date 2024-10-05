import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import Contact from '../component/contact/Contact';
import ModalExampleCloseIcon from '../component/modal/ModalExampleCloseIcon';
import axios from 'axios';
import Popover from '../component/popover/Popover';
import MultiFuncModal from '../component/modal/MultiFuncModal';
import Sender from '../component/sender_message/Sender';
import Receiver from '../component/receiver_message/Receiver';
import logo from '../assets/logo.png';
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';



import io, { Socket } from 'socket.io-client';
const socket = io.connect("http://localhost:3000", {
    withCredentials: true
})
socket.on("connect", () => {
    console.log("Connected to the server, socket ID:", socket.id);  // This will print the socket ID on the client side
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err);  // If there's any connection error, it will print the error details
});







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
    // state to change name of friend on chat window when friend tab is selected
    const [friendName, setFriendName] = useState('');
    // state to change the image of friend on chat window when friend tab is selected
    const [friendImage, setFriendImage] = useState('');
    // state to store friend phone number
    const [friendPhoneNumber, setFriendPhoneNumber] = useState('');
    // state to get socket ID of friend
    const [friendSocketId, setFriendSocketId] = useState('');
    // state to handle message input
    const [messageInput, setMessageInput] = useState({ message: "" });
    //state to clear input field
    const [clearInput, setClearInput] = useState('');
    // state to store current messages
    const [message, setMessage] = useState('');
    // state to store received messages from friend
    const [receivedMessage, setReceivedMessage] = useState('');
    // state to store array of prev messages from db
    const [prevMessageArray, setPrevMessageArray] = useState([]);
    // state tto store user phone number
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    // Create a ref for the message display for scrollbar of the Chat_message_display div always scrolls to the bottom when a new message arrives
    const messageDisplayRef = useRef(null);
    // state to change style according connection length of user if 0 then this if >0 then this
    const [contactListCss, setContactListCss] = useState(true);
    // state to change style of chat window when user is chatting with someone
    const [chatWindowCss, setChatWindowCss] = useState(true);
    // state to handle mobile view
    const [isChatOpen, setIsChatOpen] = useState(false);
    //state to store response message
    const [responseMessage, setResponseMessage] = useState("");
    const [modalOpen1, setModalOpen1] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1023) {
                setIsChatOpen(false); // Ensure both sections are shown on larger screens
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleContactClick = () => {
        setIsChatOpen(true);
    };

    const handleBackClick = () => {
        setIsChatOpen(false);
    };

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receive', (data) => {
            setReceivedMessage(data.message);
            setPrevMessageArray(prevMessages => [
                ...prevMessages,
                {
                    senderUserID: friendPhoneNumber, // Set the correct sender ID for the received message
                    receiverUserID: userPhoneNumber,  // This could be the current user's phone number
                    message: data.message,
                    createdAt: new Date() // Optionally add a timestamp
                }
            ]);
            setTimeout(scrollToBottom, 100);
        });

        // Cleanup the listener on component unmount
        return () => socket.off('receive');
    }, []);

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

            const token = await axios.get('http://localhost:3000/api/token_data', { withCredentials: true });
            const userPhone = token.data.account.phone_no;
            const connArr = response.data.connections.connection
            for (let i = 0; i < connArr.length; i++) {

                const response = await axios.post('http://localhost:3000/api/latestMessageFetch', {
                    userPhone: userPhone,
                    friendPhone: connArr[i].key
                });
                if (response.data?.data?.message) {
                    connArr[i].latest = response.data.data.message
                    const formattedTime = moment(response.data.data.createdAt).format('LT');
                    connArr[i].latestTime = formattedTime;
                }
            }
            setConnectionArray(connArr);
            setLength(response.data.connections.connection.length);

            if (response.data.connections.connection.length > 0) {
                setContactListCss(false);
            }
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


    const onChange = (e) => {
        setClearInput(e.target.value);
        setMessageInput({ ...messageInput, [e.target.name]: e.target.value })
        setMessage(e.target.value)
    }
    const handleSend = async (e) => {
        e.preventDefault();

        socket.emit('send', { friendSocketId: friendSocketId, friendPhoneNumber: friendPhoneNumber, message: message })
        setPrevMessageArray(prevMessages => [...prevMessages, {
            senderUserID: userPhoneNumber,
            receiverUserID: friendPhoneNumber,
            message: message,
            createdAt: new Date()  // add a timestamp for display
        }]);
        loadData()
        setClearInput('');
        setTimeout(scrollToBottom, 100);
    }

    const scrollToBottom = () => {
        if (messageDisplayRef.current) {
            messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
        }
    }

    const handleLogout = async () => {
        const response = await axios.post('http://localhost:3000/api/logout', { withCredentials: true })
        setResponseMessage(response.data.message)
        localStorage.removeItem('isAuthenticated');
        setModalOpen1(true)

    }

    return (
        <div className='Chat_main_div'>
            <MultiFuncModal page={'chat'} state={setModalOpen1} opening={modalOpen1} body={responseMessage} type='message' trigger={<div />}></MultiFuncModal>
            <div className={`Chat_contact ${isChatOpen ? 'hide' : ''}`} style={{ display: isChatOpen && window.innerWidth <= 1023 ? 'none' : 'flex', width: window.innerWidth <= 1023 ? '100%' : '30%' }}>
                <div className="Chat_contact_header">
                    <h2 class="ui header Chat_contact_header_chat">Chats</h2>
                    <ModalExampleCloseIcon trigger={<div>
                        <Popover trigger={<i aria-hidden="true" style={{ cursor: 'pointer' }} class="plus large icon"></i>} content="Add user"></Popover>
                    </div>} onClose={loadData}></ModalExampleCloseIcon>
                </div>
                <div className="Chat_contact_search">
                    <input className='Chat_contact_search_input' type="search" name="" id="" placeholder='Search...' />
                </div>
                {contactListCss ? (<div className='Chat_contact_before_connection'>
                    Add some friend to start Chatting
                </div>) : (
                    <div className='Chat_contact_contact'>
                        {connectionArray.map((connection, index) => (
                            <Contact length={length} id={index} key={index} name={connection.value} phone={connection.key} setSelectedContact={setSelectedContact} selectedContact={selectedContact} setFriendName={setFriendName} setFriendImage={setFriendImage} setFriendSocketId={setFriendSocketId} setFriendPhoneNumber={setFriendPhoneNumber} setPrevMessageArray={setPrevMessageArray} setUserPhoneNumber={setUserPhoneNumber} scrollToBottom={scrollToBottom} setChatWindowCss={setChatWindowCss}
                                handleContactClick={handleContactClick} latest={connection.latest} latestTime={connection.latestTime} />
                        ))}

                    </div>
                )}
                <div className='Chat_contact_footer'>
                    <div className='Chat_contact_footer_avatar_div'>
                        <MultiFuncModal state={setModalOpen} type={'profile'} trigger={<div>
                            <Popover trigger={<img style={{ cursor: 'pointer' }} src={userProfileImage} class="ui avatar image" />} content="Your Profile"></Popover>
                        </div>} />
                    </div>
                    <div>
                        <Popover trigger={<img onClick={handleLogout} style={{ cursor: 'pointer' }} width="25" height="25" src="https://img.icons8.com/fluency-systems-filled/48/logout-rounded-left.png" alt="logout-rounded-left" />} content="Log Out"></Popover>
                    </div>
                </div>
            </div>


            {chatWindowCss ? (<div className='Chat_message_befor_selecting_contact'>
                <img className='Chat_message_befor_selecting_contact_img' src={logo} alt="" />
                <h2>Start Chatting</h2>
            </div>) : (<div className={`Chat_message ${isChatOpen ? '' : 'hide'}`} style={{ display: isChatOpen ? 'flex' : 'none', width: window.innerWidth <= 1023 ? '100%' : '70%' }}>
                <div className="Chat_message_profile_header">
                    <div className='Chat_message_back_button' onClick={handleBackClick}>
                        <i aria-hidden="true" class="arrow left large fitted icon"></i>
                    </div>
                    <img src={friendImage} className="ui mini avatar image Chat_message_profile_header_image" />
                    <h3 className='Chat_message_profile_header_name'>{friendName}</h3>
                </div>
                <div className="Chat_message_display" ref={messageDisplayRef}>
                    {prevMessageArray.map((messageObj) => (
                        messageObj.senderUserID === userPhoneNumber ?
                            <Sender message={messageObj.message} /> :
                            <Receiver message={messageObj.message} />
                    ))}
                </div>
                <div className="Chat_message_footer">
                    <form onSubmit={handleSend} class="ui form Chat_message_footer_form">
                        <input value={clearInput} onChange={onChange} name='messageInput' className='Chat_message_footer_form_input' placeholder="Enter message..." />
                        <button class="ui button Chat_message_footer_form_button" type="submit">Send</button>
                    </form>
                </div>
            </div>)}

        </div>
    )
}

export default Chat
