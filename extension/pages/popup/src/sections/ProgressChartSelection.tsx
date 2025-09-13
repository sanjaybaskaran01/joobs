import React, { JSX } from "react";
import { Card, CardContent } from "../components/card";
import { Progress } from "../components/progress";
import { Separator } from "../components/separator";

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
    status: "missed",
    textColor: "text-white",
  },
  {
    day: "SUN",
    status: "inactive",
    textColor: "text-white",
  },
  {
    day: "MON",
    status: "active",
    textColor: "text-[#e525ff]",
  },
  {
    day: "TUE",
    status: "completed",
    textColor: "text-white",
  },
  {
    day: "WED",
    status: "completed",
    textColor: "text-white",
  },
  {
    day: "THU",
    status: "completed",
    textColor: "text-white",
  },
  {
    day: "FRI",
    status: "completed",
    textColor: "text-white",
  },
];

export const ProgressChartSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start w-full">
      <header className="flex h-[62px] items-center justify-around gap-[354px] px-6 py-[9px] w-full bg-transparent rounded-[20px_20px_0px_0px] overflow-hidden">
        <img className="w-[82.5px] h-[26px]" alt="Jobtrax" src="/jobtrax.png" />
      </header>

      <main className="flex flex-col items-center gap-4 p-6 w-full">
        <img
          className="w-80 h-60 object-cover"
          alt="Pixel megaman by"
          src="/pixel-3d--megaman-by-cezkid-d2s74kg-1.png"
        />

        <div className="inline-flex items-start gap-4">
          <h1 className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
            FriedCheese1234
          </h1>
        </div>

        <div className="inline-flex items-start gap-4">
          <p className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Invite Code : XQDOR
          </p>
        </div>

        <div className="flex flex-col items-start justify-center gap-1 px-0 py-2 w-full">
          <div className="flex flex-col items-start justify-end gap-1 w-full">
            <div className="inline-flex items-end gap-2.5">
              <h2 className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                Your progress
              </h2>
            </div>

            <div className="flex items-center justify-between w-full">
              <p className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-base text-center tracking-[0] leading-7 whitespace-nowrap">
                LV.1 Job Hunter
              </p>

              <div className="inline-flex items-center justify-end gap-0.5">
                <p className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-base text-center tracking-[0] leading-[22px] whitespace-nowrap">
                  10/1000XP
                </p>
              </div>
            </div>
          </div>

          <Progress value={1} className="h-5 w-full bg-[#4b4a4a]" />
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="flex-1 bg-[#43434366] rounded-[20px] border-none"
            >
              <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
                <div className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[64px] tracking-[0] leading-[64px]">
                  {stat.value}
                </div>

                <div className="flex items-center justify-around gap-3 w-full">
                  <p className="flex-1 [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[13px] tracking-[0] leading-[14.0px]">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex flex-col items-start px-0 py-[17px] w-full">
            <div className="flex items-start gap-4 w-full">
              <h2 className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#e525ff] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                Today Mission List
              </h2>
            </div>
          </div>

          {missionData.map((mission, index) => (
            <div key={index}>
              <div className="flex flex-col items-start justify-center gap-6 pt-6 pb-0 px-0 w-full">
                <div className="inline-flex flex-col items-start justify-center">
                  <p className="w-[540px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-xs tracking-[0] leading-[13.0px]">
                    {mission.description}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full">
                  <Progress
                    value={mission.progress}
                    className="w-[445px] h-3 bg-[#4b4a4a]"
                  />

                  <div className="inline-flex items-center">
                    <p className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-base text-center tracking-[0] leading-[22px] whitespace-nowrap">
                      {mission.xp}
                    </p>
                  </div>
                </div>

                <Separator className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center p-6 w-full">
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div className="flex items-center justify-around gap-4 w-full">
            <h2 className="flex-1 [font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-xl text-center tracking-[0] leading-5">
              You&apos;ve applied jobs for
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center gap-[78px] w-full">
            <div className="flex flex-col w-[143px] items-start justify-center gap-[5px]">
              <div className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-[64px] tracking-[0] leading-[64px] whitespace-nowrap">
                12
              </div>

              <p className="[font-family:'Press_Start_2P',Helvetica] font-normal text-[#03e2f6] text-base text-center tracking-[0] leading-4">
                streak days
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-start">
          {weeklyData.map((dayData, index) => (
            <div
              key={dayData.day}
              className={`flex flex-col w-[86.6px] items-center gap-2 ${index > 0 ? "-ml-2.5" : ""}`}
            >
              <div className="w-full h-[107px]">
                {dayData.status === "missed" && (
                  <div className="w-[50px] h-[50px] mt-[57px] mx-auto rounded-[25px] border-[3px] border-solid border-[#dc1010] rotate-[30deg]">
                    <div className="w-[35px] h-[59px] -mt-1 ml-[7px]">
                      <div className="absolute w-1.5 h-9 mt-[11px] ml-[15px] bg-[#dc1010] rotate-[-112.99deg]" />
                      <div className="absolute w-[3px] h-[63px] -mt-0.5 ml-4 bg-[#dc1010] rotate-[23.59deg]" />
                    </div>
                  </div>
                )}

                {dayData.status === "inactive" && (
                  <div className="w-[73px] h-[116px] mt-0 mx-auto">
                    <div className="w-[50px] h-[50px] mt-[57px] ml-[9px] rotate-[30deg]">
                      <div className="h-[50px] rounded-[25px]">
                        <div className="bg-[#919191] w-[30px] h-[30px] mt-2.5 ml-2.5 rounded-[15px]" />
                        <div className="border-[#919191] w-[50px] h-[50px] -mt-[30px] rounded-[25px] border-[3px] border-solid" />
                      </div>
                    </div>
                    <div className="w-[41px] h-[82px] -mt-[82px] ml-8">
                      <div className="w-1 h-[82px] bg-[#9f9f9f]" />
                      <div className="w-4 h-1 -mt-[82px] ml-1 bg-[#1447b6]" />
                      <div className="w-4 h-1 mt-6 ml-1 bg-[#1447b6]" />
                      <div className="w-[25px] h-1 -mt-[25px] ml-1 bg-[#1447b6]" />
                      <div className="w-[25px] h-1 mt-5 ml-1 bg-[#1447b6]" />
                      <div className="w-[33px] h-1 -mt-[21px] ml-1 bg-[#1447b6]" />
                      <div className="w-[33px] h-1 mt-4 ml-1 bg-[#1447b6]" />
                      <div className="w-[37px] h-1 -mt-[17px] ml-1 bg-[#1447b6]" />
                    </div>
                  </div>
                )}

                {dayData.status === "active" && (
                  <div className="w-[87px] h-[89px] mt-[18px] mx-auto">
                    <div className="w-[78px] h-[98px] ml-[9px]">
                      <div className="w-[50px] h-[50px] mt-[39px] ml-[9px] rotate-[30deg]">
                        <div className="h-[50px] rounded-[25px]">
                          <div className="bg-[#15a1ff] w-[30px] h-[30px] mt-2.5 ml-2.5 rounded-[15px]" />
                          <div className="border-[#15a1ff] w-[50px] h-[50px] -mt-[30px] rounded-[25px] border-[3px] border-solid" />
                        </div>
                      </div>
                      <img
                        className="w-[76px] h-16 -mt-[89px] ml-0.5 object-cover"
                        alt="Megaman classic run"
                        src="/megaman-classic-run-1.png"
                      />
                    </div>
                  </div>
                )}

                {dayData.status === "completed" && (
                  <div className="w-[50px] h-[50px] mt-[57px] mx-auto rotate-[30deg]">
                    <div className="h-[50px] rounded-[25px]">
                      <div className="w-[30px] h-[30px] mt-2.5 ml-2.5 bg-[#fff315] rounded-[15px]" />
                      <div className="w-[50px] h-[50px] -mt-[30px] rounded-[25px] border-[3px] border-solid border-[#fff315]" />
                    </div>
                  </div>
                )}
              </div>

              <p
                className={`${dayData.textColor} [font-family:'Press_Start_2P',Helvetica] font-normal text-[13px] text-center tracking-[0] leading-[13px]`}
              >
                {dayData.day}
              </p>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
};
