 

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData } from '../../services/apiServices';
import { daodocbase } from '../../data/data';

const ImageWithDetails = () => {
    const [localFormData, setLocalFormData] = useState({
        latitude: '',
        longitude: '',
        photo: '', // expecting base64
    });
    const { id } = useParams();
    const [fetchedAddress, setFetchedAddress] = useState('');

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                if (id) {
                    const response = await pendingAccountData.getDetailsS6B(id);
                    const application = response.services[0] || {};

                    // Handle base64 or normal image path
                    let photoSrc = '';
                    if (application.photo?.startsWith('/9j') || application.photo?.startsWith('iVBORw')) {
                        // If photo is base64 without prefix
                        photoSrc = `data:image/jpeg;base64,${application.photo}`;
                    } else if (application.path) {
                        photoSrc = daodocbase + application.path;
                    }

                    setLocalFormData({
                        latitude: application.latitude || '',
                        longitude: application.longitude || '',
                        photo: photoSrc,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);

    // Get address from lat/lng
    const printAddressFromLatLng = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            return data?.display_name || "Address not found";
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Error fetching address";
        }
    };

    useEffect(() => {
        if (localFormData.latitude && localFormData.longitude) {
            printAddressFromLatLng(localFormData.latitude, localFormData.longitude)
                .then(setFetchedAddress);
        }
    }, [localFormData.latitude, localFormData.longitude]);

    return (
        <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg mx-auto">
            {/* Left Side - Image */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">
                <img
                    src={localFormData.photo || 'https://via.placeholder.com/200'}
                    width="200"
                    className="m-auto border-2 border-gray-200 p-2 rounded-lg"
                    alt="client"
                />
            </div>

            {/* Right Side - Details */}
            <div className="w-full md:w-1/2">
                <div className="space-y-4">
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Latitude
                        </span>
                        <span className="text-gray-900 ml-2">{localFormData.latitude}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Longitude
                        </span>
                        <span className="text-gray-900 ml-2">{localFormData.longitude}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-geo-alt text-green-700"></i> Address
                        </span>
                        <span className="text-gray-900 ml-2">
                            {fetchedAddress || "Fetching address..."}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageWithDetails;
