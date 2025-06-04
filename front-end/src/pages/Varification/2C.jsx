import React from 'react';

const ImageWithDetails = () => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg mx-auto">
            {/* Left Side - Image */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">
                {/* <div className="border-2 border-gray-200 p-2 rounded-lg"> */}

                <img src='https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_items_boosted&w=740' width={'200px'} className='m-auto border-2 border-gray-200 p-2 rounded-lg' alt="client photo" />

                {/* </div> */}

            </div>

            {/* Right Side - Details */}
            <div className="w-full md:w-1/2">
                <div className="space-y-4">
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Latitude
                        </span>
                        <span className="text-gray-900">1915283154778</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]">
                            <i className="bi bi-send text-green-700"></i> Longitude
                        </span>
                        <span className="text-gray-900">202284979556</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700 min-w-[100px]"><i className="bi bi-geo-alt text-green-700"></i> Current Address :</span>
                        <span className="text-gray-900">
                            Wagle Estate, Centrum Business Square<br />
                            Thane East 400152
                        </span>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ImageWithDetails;