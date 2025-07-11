
import React, {useEffect} from 'react';
import {userService} from '../../services/apiServices';


export const ProfileCard = () => {
  const username=localStorage.getItem('userName');
  const userCode=localStorage.getItem('userCode');
  const rolename=localStorage.getItem('roleName');
  const bacnkname=localStorage.getItem('bankName');
  const usercode=localStorage.getItem('bankName');
  const [profileData, setProfileData] = React.useState(null);
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}


const detailsServie =async(userCode)=> {
    
        try {
            const response = await userService.getUserById(userCode);
            setProfileData(response);
            console.log('Login details : ', response.mobileNumber) 
        } catch (error) {
            console.error("Failed to fetch reason for application ID:", id, error);
            throw error; // Re-throw to allow the calling component to handle it
        }
  
    // You can add more common data fetching functions here
};

useEffect(() => {
detailsServie(userCode)

  },[userCode])




  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden text-left">
      <div className="p-3">
        <h1 className="text-xs font-bold text-gray-800 mb-2 text-center">Profile</h1>        
        <div className=" ">
          <div className='text-center'>
                  <img
                  height="40px"
                  width="40px"
                  src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                  alt="profile"
                  className="rounded-full object-cover mx-auto my-auto"
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowHelp(false); // hide help if open
                      setShowNotification(false)
                    }}
                />
        
            <h2 className="text-xs font-semibold text-gray-700 mb-0">{username}</h2>
            <p className="text-gray-500 text-xs">{rolename}</p>
      
          </div>
          
          <div className="border-t border-gray-200 py-2 my-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium text-gray-500">DOB</p>
                <p className="text-gray-800 text-xs">-</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-800 text-xs">{profileData && profileData.mobileNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Employee ID</p>
                <p className="text-gray-800 text-xs">{toTitleCase(usercode)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Bank Name</p>
                <p className="text-gray-800 text-xs">{toTitleCase(bacnkname)}</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ProfileCard