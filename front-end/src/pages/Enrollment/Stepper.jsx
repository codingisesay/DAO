import React from 'react';
import payvanceLogo from '../../assets/imgs/payvance_dark_logo.png';

const Stepper = () => {
    return (
        <>
            <div className='stepper-container max-w-md  mx-auto p-10'>
                <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo mx-auto" />

                <ul className='max-w-md  mx-auto'>
                    <li>
                        <i class="bi bi-columns-gap"></i> &nbsp;
                        Dashboard
                    </li>
                </ul>
                <p className='my-3'>Start Digital Account Opening</p>

                <div class="max-w-md  mx-auto ">
                    <div class="vertical-stepper">
                        <div class="stepper-item completed">
                            <div class="stepper-number">
                                <i class="bi bi-clipboard-minus"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 1</div>
                                <div class="stepper-title">Enrollment Details</div>
                            </div>
                        </div>
                        <div class="stepper-item active">
                            <div class="stepper-number">
                                <i class="bi bi-file-earmark-text"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 2</div>
                                <div class="stepper-title">Customer Application</div>
                            </div>
                        </div>
                        <div class="stepper-item">
                            <div class="stepper-number">
                                <i class="bi bi-file-earmark-richtext"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 3</div>
                                <div class="stepper-title">Document Details</div>
                            </div>
                        </div>
                        <div class="stepper-item">
                            <div class="stepper-number">
                                <i class="bi bi-person-badge"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 4</div>
                                <div class="stepper-title">Video - KYC</div>
                            </div>
                        </div>
                        <div class="stepper-item">
                            <div class="stepper-number">
                                <i class="bi bi-person-vcard"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 5</div>
                                <div class="stepper-title">Account Details</div>
                            </div>
                        </div>
                        <div class="stepper-item">
                            <div class="stepper-number">
                                <i class="bi bi-file-text"></i>
                            </div>
                            <div>
                                <div class="stepper-subtitle">STEP 6</div>
                                <div class="stepper-title">Summary Sheet</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stepper;
