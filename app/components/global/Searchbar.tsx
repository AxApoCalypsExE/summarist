import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Searchbar = () => {
  return (
    <div className="w-full h-20 border-b border-gray-300 flex items-center justify-center">
      <div className="max-w-5xl w-full flex justify-end">
        <div className="relative mr-3">
          <input 
            type="text"
            placeholder="Search for books"
            className="border-2 focus:outline-none focus:border-slate-200 border-slate-200 bg-slate-50 py-2 text-sm w-[340px] rounded-lg pl-4 pr-10"
          />
          <AiOutlineSearch className="absolute top-1/2 right-2 -translate-y-1/2 text-2xl border-l-2 h-full w-9 pl-2" />
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
