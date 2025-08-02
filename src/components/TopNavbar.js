import React from "react";

const TopNavbar = ({ username }) => (
  <header className="fixed top-0 left-0 w-full h-14 bg-[#EA7125] flex items-center justify-end pr-8 z-40 shadow transition-all duration-300">
    <div className="text-white text-base font-medium">
      Welcome, <span className="font-bold">{username}!</span>
    </div>
  </header>
);

export default TopNavbar;