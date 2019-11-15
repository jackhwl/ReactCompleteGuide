import React from 'react'

const Validation = (props) => {
    let validationText = 'Text too short'
    if (props.length>5) validationText = 'Text long enough'
    return (
        <div>
            { validationText }
        </div>
    )
}

export default Validation
