import React from 'react';

const userOutput = (props) => {
    const style = {
        fontSize: '20px',
        fontWeight: 'bold'
    };
    return (
        <div>
            <div style={style}>User: {props.name}</div>
            <div>p2</div>
        </div>
    )
}

export default userOutput;