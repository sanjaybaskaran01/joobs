import React, { JSX } from "react";
import { MissionListSection } from "../sections/MissionList";
import { ProgressChartSection } from "../sections/ProgressChart";

export const FinalScreen = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen items-start relative bg-[#111111] overflow-hidden">
      <div className="top-[131px] left-[139px] bg-[#0f8999cc] absolute w-[269px] h-[269px] rounded-[134.5px] blur-[53.8px]" />

      <div className="top-[556px] left-[373px] bg-[#d149cccc] absolute w-[269px] h-[269px] rounded-[134.5px] blur-[53.8px]" />

      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <ProgressChartSection />
        <MissionListSection />
      </div>
    </div>
  );
};
