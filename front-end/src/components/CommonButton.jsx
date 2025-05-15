import React from 'react';

const CommonButton = ({
    type = "button",
    className = "",
    onClick,
    children,
    disabled = false
}) => {
    return (
        <button
            type={type}
            className={` ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default CommonButton;
