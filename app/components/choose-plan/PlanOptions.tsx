"use client";

import React, { useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa6";
import { RiPlantFill } from "react-icons/ri";

const PlanOptions = () => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <div>
      <div className="grid grid-cols-3 justify-items-center gap-6 max-w-[800px] mx-auto mb-14">
        <div className="flex flex-col text-center items-center justify-center">
          <AiFillFileText className="text-6xl" />
          <p>Key ideas in few min with many books to read</p>
        </div>
        <div className="flex flex-col text-center items-center justify-center">
          <RiPlantFill className="text-6xl" />
          <p>3 million people growing with Summarist everyday</p>
        </div>
        <div className="flex flex-col text-center items-center justify-center">
          <FaHandshake className="text-6xl" />
          <p>Precise recommendations collections curated by experts</p>
        </div>
      </div>

      <div>
        <h1 className="text-[2rem] font-bold text-center mb-8">
          Choose the plan that fits you
        </h1>

        <div
          className={`border-4 ${
            selectedPlan === "yearly" ? "border-green-400" : "border-[#bac8ce]"
          } bg-[#f1f6f4] gap-6 p-6 cursor-pointer mx-auto max-w-[680px] rounded flex`}
          onClick={() => setSelectedPlan("yearly")}
        >
          <div className="h-6 w-6 relative rounded-[50%] border-primary border-2 flex items-center justify-center">
            <div
              className={`w-[6px] h-[6px] absolute rounded-[50%] bg-primary ${
                selectedPlan === "yearly" ? "block" : "hidden"
              }`}
            />
          </div>
          <div className="gap-2 flex flex-col">
            <div className="text-lg font-bold">Premium Plus Yearly</div>
            <div className="text-2xl font-bold">$99.99/year</div>
            <div className="text-sm text-primary/50">
              7-day free trial included
            </div>
          </div>
        </div>

        <div className="text-sm text-primary/50 flex items-center gap-2 max-w-60 my-6 mx-auto before:flex-grow before:h-[1px] before:bg-primary/50 after:flex-grow after:h-[1px] after:bg-primary/50">
          or
        </div>

        <div
          className={`border-4 ${
            selectedPlan === "monthly" ? "border-green-400" : "border-[#bac8ce]"
          } bg-[#f1f6f4] gap-6 p-6 cursor-pointer mx-auto max-w-[680px] rounded flex`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="h-6 w-6 relative rounded-[50%] border-primary border-2 flex items-center justify-center">
            <div
              className={`w-[6px] h-[6px] absolute rounded-[50%] bg-primary ${
                selectedPlan === "monthly" ? "block" : "hidden"
              }`}
            />
          </div>
          <div className="gap-2 flex flex-col">
            <div className="text-lg font-bold">Premium Plus Monthly</div>
            <div className="text-2xl font-bold">$9.99/month</div>
            <div className="text-sm text-primary/50">No trial included</div>
          </div>
        </div>
      </div>

      {selectedPlan === "yearly" ? (
        <div className="sticky z-10 py-8 flex flex-col items-center gap-4 bottom-0 bg-white">
          <button className="btn max-w-[300px]">
            Start your free 7-day trial
          </button>
          <p className="text-[12px] text-primary/50 text-center">
            Cancel your trial at any time before it ends, and you won’t be
            charged.
          </p>
        </div>
      ) : (
        <div className="sticky z-10 py-8 flex flex-col items-center gap-4 bottom-0 bg-white">
          <button className="btn max-w-[300px]">Start your first month</button>
          <p className="text-[12px] text-primary/50 text-center">
            30-day money back guarantee, no questions asked.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanOptions;
