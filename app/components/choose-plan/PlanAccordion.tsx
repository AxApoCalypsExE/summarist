"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";

const PlanAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [contentHeights, setContentHeights] = useState<number[]>([]);

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const accordionData = [
    {
      title: "How does the free 7-day trial work?",
      content:
        "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
      title:
        "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      content:
        "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    },
    {
      title: "What's included in the Premium plan?",
      content:
        "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    },
    {
      title: "Can I cancel during my trial or subscription?",
      content:
        "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    },
  ];

  useEffect(() => {
    const heights = contentRefs.current.map((ref) => (ref ? ref.scrollHeight : 0));
    setContentHeights(heights);
  }, []);

  return (
    <div>
      {accordionData.map((item, index) => (
        <div key={index} className="border-b border-b-gray-300 overflow-hidden">
          <div
            className="flex justify-between items-center cursor-pointer py-6 gap-2"
            onClick={() => toggleAccordion(index)}
          >
            <h1 className="font-semibold text-2xl relative transition-all">
              {item.title}
            </h1>
            <SlArrowDown
              className={`w-6 h-6 ease-in-out transition-transform duration-[400ms] ${
                activeIndex === index ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            ref={(el) => {
              contentRefs.current[index] = el;
            }}
            style={{
              maxHeight: activeIndex === index ? `${contentHeights[index]}px` : "0px",
            }}
            className={`ease-in-out transition-max-height duration-[400ms] overflow-hidden`}
          >
            <p className="pb-6 leading-normal">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanAccordion;
