import Sidebar from "@/app/components/global/Sidebar";
import React from "react";

const MyLibrary = () => {
  return (
    <>
      <Sidebar />
      <div className="w-full h-[80vh] flex items-center justify-center">
        <h1 className="text-4xl font-bold">Library Coming Soon...</h1>
      </div>
      {/* <div className="w-[1070px] px-6 mx-auto pt-10">
        <h1 className="text-[22px] font-bold">Saved Books</h1>
        <p>0 items</p>
      </div> */}
    </>
  );
};

export default MyLibrary;
