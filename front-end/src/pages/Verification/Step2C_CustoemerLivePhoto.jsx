
import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices'; // <-- Import your service
import { daodocbase } from '../../data/data';


const ImageWithDetails = () => {
    const [localFormData, setLocalFormData] = useState({
        latitude: '',
        longitude: '',
        photo: '',
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS2C(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    console.log('got data 2C :', response.photos);
                    const application = response.photos[0] || {};
                    // const personal = response?.data?.personal_details || {};

                    setLocalFormData({

                        latitude: application.latitude || '',
                        longitude: application.longitude || '',
                        photo: daodocbase + application.path || '',

                    });
                    // alert(localFormData.photo);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);

const [fetchedAddress, setFetchedAddress] = useState("");
// Add this inside your component (or outside if you prefer)
const printAddressFromLatLng = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Address not found";
    }
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
        <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg mx-auto mb-20">
            {/* Left Side - Image */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">

                {/* <img src='https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_items_boosted&w=740' width={'200px'} className='m-auto border-2 border-gray-200 p-2 rounded-lg' alt="client photo" /> */}
                <img src={localFormData.photo} width={'200px'} className='m-auto border-2 border-gray-200 p-2 rounded-lg' alt="client photo" />


            </div>

            {/* Right Side - Details */}
            <div className="w-full md:w-1/2">
                <div className="space-y-4">
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Latitude
                        </span>
                        <span className="text-gray-900">{localFormData.latitude}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Longitude
                        </span>
                        <span className="text-gray-900">{localFormData.longitude}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-geo-alt text-green-700"></i>Address :
                        </span>
                        <span className="text-gray-900">
                            {fetchedAddress || "Fetching address..."}
                        </span>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ImageWithDetails;