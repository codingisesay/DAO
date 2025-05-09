import React from 'react';

function p3({ onNext, onBack }) {
    return (
        <>
            <h1>3</h1>

            <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div>
        </>);
}

export default p3;