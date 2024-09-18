import Image from "next/image";
import React from "react";

interface SelectedProps {
  img: string;
  subTitle: string;
}

const Selected = ({ img, subTitle } : SelectedProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-[22px] font-bold mb-4">Selected just for you</h1>
      <div className="bg-amber-100">
        <h3>{subTitle}</h3>
        <div>
          <Image src={img} alt="book cover" height={600} width={600} />
        </div>
      </div>
    </div>
  );
};

export default Selected;
