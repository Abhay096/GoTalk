import React from 'react';
import './Sender.css'

function Sender({ message }) {
    return (
        <>
            <div className="sender">
                <div className="sender_message">
                    {message}
                </div>
            </div>
        </>
    )
}

export default Sender
