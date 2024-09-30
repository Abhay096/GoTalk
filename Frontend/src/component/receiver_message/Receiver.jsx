import React from 'react';
import './Receiver.css';

function Receiver({ message }) {
    return (
        <>
            <div className="receiver">
                <div className="receiver_message">
                    {message}
                </div>
            </div>
        </>
    )
}

export default Receiver
