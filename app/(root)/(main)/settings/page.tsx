import Searchbar from "@/app/components/global/Searchbar";
import Sidebar from "@/app/components/global/Sidebar";
import React from "react";

const Settings = () => {
  return (
    <>
      <Sidebar />
      <div className="h-[100rem]">
        <Searchbar />
        <div>Settings</div>
      </div>
    </>
  );
};

export default Settings;
