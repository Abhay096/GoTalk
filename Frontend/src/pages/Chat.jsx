import React from 'react';
import './Chat.css';
import Contact from '../component/contact/Contact';
import ModalExampleCloseIcon from '../component/modal/ModalExampleCloseIcon';

function Chat() {
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
            </div>
            <div className='Chat_message'>j</div>
        </div>
    )
}

export default Chat
