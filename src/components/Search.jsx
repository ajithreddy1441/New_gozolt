import React from "react";
import Sidebar from "./Sidebar"; // Your existing sidebar component
import Cars from "./Cars"; // Your existing car listing component

const CarRentalLayout = () => {
  return (
    <div className=" mx-auto px-4 lg:px-10 py-6">
      <div className="flex gap-2">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <Sidebar />
        </div>

        {/* Car Listings */}
        <div className="w-full lg:w-3/4">
          <Cars />
        </div>
      </div>
    </div>
  );
};

export default CarRentalLayout;
