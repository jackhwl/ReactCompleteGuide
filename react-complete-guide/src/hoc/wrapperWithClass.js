import React from 'react';

const wrapperWithClass = (WrappedComponent, className) => {
    return props => (
        <div className={className}>
            <WrappedComponent />
        </div>
    );
};

export default wrapperWithClass;
