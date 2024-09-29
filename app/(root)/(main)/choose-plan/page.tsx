import PlanAccordion from "@/app/components/choose-plan/PlanAccordion";
import PlanLanding from "@/app/components/choose-plan/PlanLanding";
import PlanOptions from "@/app/components/choose-plan/PlanOptions";
import Footer from "@/app/components/Footer";
import React from "react";

const ChoosePlan = () => {
  return (
    <div className="-ml-[200px]">
      <PlanLanding />
      <div className="mx-auto px-6 max-w-[1070px] flex justify-center">
        <div className="py-10">
          <PlanOptions />
          <PlanAccordion />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChoosePlan;
