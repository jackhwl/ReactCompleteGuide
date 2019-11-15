import React from 'react'

const UserInput = (props) => {
    return (
        <div>
            <input type="text" onChange={props.nameChange}  value={props.username} />
        </div>
    )
}

export default UserInput
