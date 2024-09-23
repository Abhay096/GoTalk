import React from 'react';
import logo from '../../assets/logo.png'
import './Contact.css'
import defimg from '../../assets/defimg.jpg'

function Contact() {
    return (
        <div className='Contact_main_div'>
            <div className='Contact_image_div'>
                <img src={defimg} className="ui avatar image Contact_image" />
            </div>
            <div className='Contact_name_div'>
                <div>Name</div>
                <div>This is the message</div>
            </div>
            <div className='Contact_time_div'>2:30 PM</div>
        </div>
    )
}

export default Contact
