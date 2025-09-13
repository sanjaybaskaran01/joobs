import { JSX } from "react";
import { Card, CardContent } from "../components/card";

const statsData = [
  {
    value: "1",
    label: "Job Applications",
  },
  {
    value: "1",
    label: "Acheivements",
  },
];

const missionData = [
  {
    description: "Submitted a job application",
    progress: 0,
    xp: "10XP",
  },
  {
    description: "Applied to 5 jobs in a single day",
    progress: 20,
    xp: "20XP",
  },
];

const weeklyData = [
  {
    day: "SAT",
    hasActivity: false,
    isToday: false,
    className: "text-white",
  },
  {
    day: "SUN",
    hasActivity: true,
    isToday: false,
    className: "text-white",
  },
  {
    day: "MON",
    hasActivity: true,
    isToday: true,
    className: "text-[#e525ff]",
  },
  {
    day: "TUE",
    hasActivity: true,
    isToday: false,
    className: "text-white",
  },
  {
    day: "WED",
    hasActivity: true,
    isToday: false,
    className: "text-white",
  },
  {
    day: "THU",
    hasActivity: true,
    isToday: false,
    className: "text-white",
  },
  {
    day: "FRI",
    hasActivity: true,
    isToday: false,
    className: "text-white",
  },
];

export const ProgressChartSection = (): JSX.Element => {
  return (
    <div className="flex flex-col items-start relative w-full">
      <header className="flex h-[50px] sm:h-[62px] items-center justify-center px-4 sm:px-6 py-2 sm:py-[9px] relative w-full bg-transparent rounded-[20px_20px_0px_0px] overflow-hidden">
        <img
          className="relative h-[22px] sm:h-[26px]"
          alt="Jobtrax"
          src="/popup/JOBTRAX.png"
        />
      </header>

      <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 relative w-full">
        <img
          className="relative w-64 h-48 sm:w-80 sm:h-60 object-cover"
          alt="Pixel megaman by"
          src="/popup/image5.png"
        />

        <div className="inline-flex items-start gap-4 relative">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-lg sm:text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
            FriedCheese1234
          </div>
        </div>

        <div className="inline-flex items-start gap-4 relative">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-sm sm:text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Invite Code : XQDOR
          </div>
        </div>

        <div className="flex flex-col items-start justify-center gap-1 px-0 py-2 relative w-full">
          <div className="flex flex-col items-start justify-end gap-1 relative w-full">
            <div className="inline-flex items-end gap-2.5 relative">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                Your progress
              </div>
            </div>

            <div className="flex items-center justify-between relative w-full">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-sm sm:text-base text-center tracking-[0] leading-7 whitespace-nowrap">
                LV.1 Job Hunter
              </div>

              <div className="inline-flex items-center justify-end gap-0.5 relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-sm sm:text-base text-center tracking-[0] leading-[22px] whitespace-nowrap">
                  10/1000XP
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-3 sm:h-5 items-center relative w-full bg-[#4b4a4a] rounded">
            <div className="relative h-full w-[10%] bg-[#03e2f6] rounded-l" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 relative w-full">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="flex-1 bg-[#43434366] rounded-[20px] border-none"
            >
              <CardContent className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6">
                <div className="relative w-full [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[48px] sm:text-[64px] tracking-[0] leading-[48px] sm:leading-[64px]">
                  {stat.value}
                </div>

                <div className="flex items-center justify-around gap-3 relative w-full">
                  <div className="relative flex-1 mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[11px] sm:text-[13px] tracking-[0] leading-[12px] sm:leading-[14.0px]">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 relative w-full">
          <div className="flex flex-col items-start px-0 py-[17px] relative w-full">
            <div className="flex items-start gap-4 relative w-full">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                Today Mission List
              </div>
            </div>
          </div>

          {missionData.map((mission, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-center gap-6 pt-6 pb-0 px-0 relative w-full"
            >
              <div className="inline-flex flex-col items-start justify-center relative">
                <div className="relative w-full max-w-[540px] mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-xs tracking-[0] leading-[13.0px] break-words">
                  {mission.description}
                </div>
              </div>

              <div className="flex items-center justify-between relative w-full">
                <div className="flex items-center gap-2 pl-0 pr-4 py-0 relative flex-1 max-w-[445px] h-3 bg-[#4b4a4a] rounded">
                  {mission.progress > 0 && (
                    <div className="relative h-full bg-[#03e2f6] rounded-l" style={{ width: `${mission.progress}%` }} />
                  )}
                </div>

                <div className="inline-flex items-center relative ml-4">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-sm sm:text-base text-center tracking-[0] leading-[22px] whitespace-nowrap">
                    {mission.xp}
                  </div>
                </div>
              </div>

              <img
                className="relative w-full"
                alt="Divider"
                src="/divider.svg"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 relative w-full">
        <div className="flex flex-col items-center justify-center gap-6 relative w-full">
          <div className="flex items-center justify-around gap-4 relative w-full">
            <div className="relative flex-1 mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-xl text-center tracking-[0] leading-5">
              You&apos;ve applied jobs for
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-[78px] relative w-full">
            <div className="flex flex-col w-[143px] items-start justify-center gap-[5px] relative">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[64px] tracking-[0] leading-[64px] whitespace-nowrap">
                12
              </div>

              <div className="relative w-full [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-base text-center tracking-[0] leading-4">
                streak days
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex items-start relative">
          {weeklyData.map((day, index) => (
            <div
              key={day.day}
              className={`flex flex-col w-[60px] sm:w-[86.6px] items-center gap-2 relative ${index > 0 ? "-ml-1 sm:-ml-2.5" : ""}`}
            >
              <div className="relative w-full h-[107px]">
                {day.day === "SAT" && (
                  <img
                    className="absolute w-[87px] h-[50px] top-[57px] left-0"
                    alt="Frame"
                    src="/popup/components/frame-37-1.svg"
                  />
                )}
                {day.day === "SUN" && (
                  <img
                    className="relative w-full h-[107px]"
                    alt="Component"
                    src="/popup/components/component-2.svg"
                  />
                )}
                {day.day === "MON" && (
                  <div className="relative w-[87px] h-[85px] top-[22px] -left-px">
                    <img
                      className="absolute w-[87px] h-[50px] top-[35px] left-0"
                      alt="Bll"
                      src="/popup/components/bll-1.svg"
                    />
                    <img
                      className="absolute w-[71px] h-[60px] top-0 left-[13px] object-cover"
                      alt="Megaman classic run"
                      src="/popup/component/megaman-classic-run-2.svg"
                    />
                  </div>
                )}
                {(day.day === "TUE" ||
                  day.day === "WED" ||
                  day.day === "THU" ||
                  day.day === "FRI") && (
                  <img
                    className="absolute w-[87px] h-[50px] top-[57px] left-0"
                    alt="Bll"
                    src="/bll-1.svg"
                  />
                )}
              </div>

              <div
                className={`relative w-full [font-family:'Press_Start_2P',Helvetica] font-normal text-[11px] sm:text-[13px] text-center tracking-[0] leading-[11px] sm:leading-[13px] ${day.className}`}
              >
                {day.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
