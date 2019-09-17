import React from 'react';
import './UserInput.css'

const userInput = (props) => {
    return (
        <div className="inputSec">
            <input type="text" value={props.name} onChange={props.changed} />
        </div>
    )
};

export default userInput;