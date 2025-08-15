import React from "react";
import Sidebar from "./Sidebar";
import HeaderSearch from "./HeaderSearch";
import Cars from "./Cars";

const CarRentalLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:container mx-auto lg:px-2 py-4">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
            <Sidebar />
          </div>
          
          {/* Main content area */}
          <div className="">
            <HeaderSearch />
            <Cars />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalLayout;