import React, { JSX } from "react";
import { MissionListSection } from "../sections/MissionSelection";
import { ProgressChartSection } from "../sections/ProgressChartSelection";

export const FinalScreen = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen items-start relative bg-[#111111] overflow-hidden">
      <div className="absolute w-[269px] h-[269px] top-[131px] left-[139px] bg-[#0f8999cc] rounded-[134.5px] blur-[53.8px]" />

      <div className="absolute w-[269px] h-[269px] top-[556px] left-[373px] bg-[#d149cccc] rounded-[134.5px] blur-[53.8px]" />

      <div className="flex flex-col items-start relative self-stretch w-full">
        <ProgressChartSection />
        <MissionListSection />
      </div>
    </div>
  );
};
