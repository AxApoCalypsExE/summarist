import Searchbar from "@/app/components/global/Searchbar";
import Sidebar from "@/app/components/global/Sidebar";
import React from "react";

const MyLibrary = () => {
  return (
    <>
      <Sidebar />
      <div className="h-[100rem]">
        <Searchbar />
        <div>MyLibrary</div>
      </div>
    </>
  );
};

export default MyLibrary;
