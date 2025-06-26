import React from 'react'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="w-full p-1 bottom-0  text-center text-sm mt-auto">
  <div className=" mx-10 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
    <p className="copyright text-xs">
      ©{new Date().getFullYear()} PayVance Technologies Pvt. Ltd. All rights reserved.
    </p>
    <p className="version-info text-xs">
      Version: 1.0.0 | Base Release: April 2025
    </p>
  </div>
</footer>

  );
};

export default Footer;
 