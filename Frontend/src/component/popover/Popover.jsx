import React from 'react';
import './Popover.css';
import { Popup } from 'semantic-ui-react';

const Popover = ({ trigger, content }) => (
    <Popup content={content} trigger={trigger} />
)

export default Popover
