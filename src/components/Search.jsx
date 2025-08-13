import React from "react";
import Sidebar from "./Sidebar";
import Cars from "./Cars"; 

const CarRentalLayout = () => {
  return (
    <div className=" lg:px-4 py-4">
      <div className="flex ">
        <>
          <Sidebar />
          <Cars />
        </>
      </div>
    </div>
  );
};

export default CarRentalLayout;
