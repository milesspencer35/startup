import React from "react";
import './popup.css';

export const Popup = ({ children, handleClose }) => {
    return (
        <div className="popup-box">
            <div className="box">
                {children}
            </div>
        </div>
    );
};