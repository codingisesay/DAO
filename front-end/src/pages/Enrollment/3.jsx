import React from 'react';

function p3({ onNext, onBack }) {
    return (<h1>3
        <button onClick={onNext}>Next</button>
        <button onClick={onBack}>Back</button>
    </h1>);
}

export default p3;