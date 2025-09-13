import React, { JSX } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";

export const MissionListSection = (): JSX.Element => {
  const friendsData = [
    {
      id: 1,
      name: "Pzc",
      level: "LV.12 Job Hunter",
      streaks: "20 streaks",
      icon: "/icon-4.svg",
      highlighted: true,
    },
    {
      id: 2,
      name: "Jobhunter102",
      level: "LV.10 Job Hunter",
      streaks: "17 streaks",
      icon: "/icon-2.svg",
      highlighted: false,
    },
    {
      id: 3,
      name: "Recruitme12",
      level: "LV.23 Job Hunter",
      streaks: "9 streaks",
      icon: "/icon.svg",
      highlighted: false,
    },
    {
      id: 4,
      name: "Mindful999",
      level: "LV.52 Job Hunter",
      streaks: "8 streaks",
      icon: "/icon-1.svg",
      highlighted: false,
    },
    {
      id: 5,
      name: "HandofGod333",
      level: "LV.99 Job Hunter",
      streaks: "6 streaks",
      icon: "/icon-3.svg",
      highlighted: false,
    },
  ];

  return (
    <section className="flex flex-col h-[724px] items-start gap-6 p-6 relative self-stretch w-full">
      <header className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <h2 className="relative w-fit [font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
          Friends &amp; Rankings
        </h2>

        <Button
          variant="outline"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-4 relative flex-[0_0_auto] bg-[#16161666] border border-solid border-[#03e2f6] h-auto hover:bg-[#16161680]"
        >
          <span className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap">
            Add a friend
          </span>
        </Button>
      </header>

      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        {friendsData.map((friend) => (
          <Card
            key={friend.id}
            className={`${friend.highlighted ? "bg-[#43434366]" : "bg-transparent"} flex flex-col items-center justify-center gap-6 p-4 relative self-stretch w-full flex-[0_0_auto] border-none`}
          >
            <CardContent className="flex w-[497px] items-center gap-3 relative flex-[0_0_auto] p-0">
              <img
                className="relative w-[60px] h-[60px]"
                alt="Icon"
                src={friend.icon}
              />

              <div className="flex items-center justify-between relative flex-1 grow">
                <div className="inline-flex flex-col items-start justify-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                    {friend.name}
                  </div>

                  <div className="relative w-fit [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                    {friend.level}
                  </div>
                </div>

                <div className="inline-flex items-center relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap">
                    {friend.streaks}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
