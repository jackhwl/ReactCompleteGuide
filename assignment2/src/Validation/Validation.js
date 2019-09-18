import React from 'react';

const validation = (props) => {
    const result = props.length > 5 ? "Text long enough" : "Text is too short";
    return (
        <div>{result}</div>
    )
}

export default validation;