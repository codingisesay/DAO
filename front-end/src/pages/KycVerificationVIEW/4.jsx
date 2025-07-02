
import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import   { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices'; // <-- Import your service
import { useNavigate } from 'react-router-dom';
 
function p4({ onNext, onBack }) { 
    const navigate = useNavigate();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const { id } = useParams();
 
    return (
        <>

            <p className="text-xl font-bold">Video - KYC</p>
 
            <div className="next-back-btns z-10">
                <CommonButton className="btn-back border-0" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton className="btn-next border-0" onClick={() => navigate(-1)}>
                    Cancel
                </CommonButton>
            </div>
        </>);
}

export default p4;