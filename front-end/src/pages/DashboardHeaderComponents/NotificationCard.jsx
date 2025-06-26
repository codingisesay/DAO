// import React from 'react';
 
//  const NotificationDd = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden text-left">
//       <div className="p-3">
//         <h1 className="text-xs font-bold text-gray-800 mb-2">Profile</h1>
        
//         <div className=" ">
//           <div>
//             <h2 className="text-xs font-semibold text-gray-700 mb-0">Vaibhav Talekar</h2>
//             <p className="text-gray-500 text-xs">Agent</p>
//           </div>
          
//           <div className="border-t border-gray-200 py-2 my-2">
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <p className="text-xs font-medium text-gray-500">DOB</p>
//                 <p className="text-gray-800 text-xs">15/05/1995</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-500">Phone Number</p>
//                 <p className="text-gray-800 text-xs">+917845784581</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-500">Employee ID</p>
//                 <p className="text-gray-800 text-xs">0015</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-500">Bank Name</p>
//                 <p className="text-gray-800 text-xs">Bank of Baroda</p>
//               </div>
//             </div>
//           </div>
        
//         </div>
//       </div>
//     </div>
//   );
// };


// export default NotificationDd;

import React from 'react';

const NotificationItem = ({ name, applicationNumber, action, adminName, reason }) => (
  <div className="mb-4 last:mb-0 text-start">
    <p className="text-sm font-semibold text-gray-800">{name}</p>
    <p className="text-xs text-gray-600">
      Customer Application No. {applicationNumber} {action} by Admin {adminName} due to {reason}
    </p>
  </div>
);

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-1 w-full max-w-md">
      <h2 className="text-sm text-center text-lg font-bold text-gray-800 mb-4 border-b pb-2">Notification</h2>
      
      <div className="">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            name={notification.name}
            applicationNumber={notification.applicationNumber}
            action={notification.action}
            adminName={notification.adminName}
            reason={notification.reason}
          />
        ))}
      </div>
    </div>
  );
};

// Example usage:
const Notification = () => {
  const notifications = [
    {
      name: "Riya Singh",
      applicationNumber: "1254",
      action: "rejected",
      adminName: "Rajesh Kumar",
      reason: "PAN card error"
    },
    {
      name: "Riya Singh",
      applicationNumber: "1254",
      action: "rejected",
      adminName: "Rajesh Kumar",
      reason: "PAN card error"
    }
    // Add more notifications as needed
  ];

  return (
    <div className="">
      <NotificationPanel notifications={notifications} />
    </div>
  );
};

export default Notification;