import React from 'react';

function p5({ onNext, onBack }) {
    return (<h1>5
        <button onClick={onNext}>Next</button>
        <button onClick={onBack}>Back</button>
    </h1>);
}

export default p5;