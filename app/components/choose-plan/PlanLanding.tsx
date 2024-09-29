import Image from "next/image";
import React from "react";

const PlanLanding = () => {
  return (
    <div className="w-full bg-primary rounded-b-[15rem] text-white pt-12 mb-6 flex justify-center">
      <div className="flex flex-col mt-4 items-center max-w-[1000px]">
        <h1 className="font-bold text-5xl mb-10 text-center">
          Get unlimited access to many amazing books to read
        </h1>
        <p className="text-xl mb-8 font-semibold">
          Turn ordinary moments into amazing learning opportunities
        </p>
        <figure className="max-w-[340px] overflow-hidden rounded-t-full">
          <Image
            alt="pricing image"
            src="/pricing-top.png"
            width={600}
            height={600}
          />
        </figure>
      </div>
    </div>
  );
};

export default PlanLanding;
