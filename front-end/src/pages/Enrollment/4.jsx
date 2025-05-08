import React from 'react';

function p4({ onNext, onBack }) {
    return (<h1>4
        <button onClick={onNext}>Next</button>
        <button onClick={onBack}>Back</button>
    </h1>);
}

export default p4;