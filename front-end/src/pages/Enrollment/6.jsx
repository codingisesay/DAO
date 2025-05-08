import React from 'react';

function p6({ onNext, onBack }) {
    return (<h1>6
        <button onClick={onNext}>Next</button>
        <button onClick={onBack}>Back</button>
    </h1>);
}

export default p6;