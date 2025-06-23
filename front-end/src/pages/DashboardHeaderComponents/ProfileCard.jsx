import React from 'react';

const ProfileCard = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden text-left">
      <div className="p-3">
        <h1 className="text-xs font-bold text-gray-800 mb-2">Profile</h1>
        
        <div className=" ">
          <div>
            <h2 className="text-xs font-semibold text-gray-700 mb-0">Vaibhav Talekar</h2>
            <p className="text-gray-500 text-xs">Agent</p>
          </div>
          
          <div className="border-t border-gray-200 py-2 my-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium text-gray-500">DOB</p>
                <p className="text-gray-800 text-xs">15/05/1995</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-800 text-xs">+917845784581</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Employee ID</p>
                <p className="text-gray-800 text-xs">0015</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Bank Name</p>
                <p className="text-gray-800 text-xs">Bank of Baroda</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;