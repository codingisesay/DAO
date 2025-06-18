import React from 'react';

const ProfileCard = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-8">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Vaibhav Talekar</h2>
            <p className="text-gray-500">Agent</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">DOB</p>
                <p className="text-gray-800">15/05/1995</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-800">+917845784581</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p className="text-gray-800">0015</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bank Name</p>
                <p className="text-gray-800">Bank of Baroda</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Preferences</h3>
            <div>
              <p className="text-sm font-medium text-gray-500">Theme</p>
              {/* Add theme selector component here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;