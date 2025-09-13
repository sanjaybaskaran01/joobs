import React, { JSX, useState, useEffect } from 'react';
import { Button } from '../components/button';
import { Card, CardContent } from '../components/card';
import { Progress } from '../components/progress';
import { Separator } from '../components/separator';
import { fetchUserProfile, fetchUserAchievements, getUser, fetchUserJobsApplied } from '../api/api';

// This will be computed dynamically in the component

type Achievement = {
  description: string;
  xp: number;
  completed: boolean;
};

interface ProfileProps {
  onBack: () => void;
}

export const Profile = ({ onBack }: ProfileProps): JSX.Element => {
  const [userProfile, setUserProfile] = useState<{ xp: number; invite_code: string } | null>(null);

  const [userInfo, setUserInfo] = useState<{ xp: number; invite_code: string; name: string } | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [jobsApplied, setJobsApplied] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile details (xp, invite_code from user_details route)
        const profileData = await fetchUserProfile();
        setUserProfile(profileData);

        // Fetch user info (name, email from /auth/me route)
        const userData = await getUser();
        setUserInfo(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Set default values if API fails
        setUserProfile({ xp: 0, invite_code: 'N/A' });
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchAchievementsData = async () => {
      try {
        setAchievementsLoading(true);
        const data = await fetchUserAchievements();
        // Sort achievements: Uncompleted first, then by XP (lower to higher)
        const sortedAchievements = data.achievements.sort((a, b) => {
          // Primary sort: uncompleted (false) before completed (true)
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          // Secondary sort: lower XP before higher XP
          return a.xp - b.xp;
        });
        setAchievements(sortedAchievements);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
        setAchievements([]);
      } finally {
        setAchievementsLoading(false);
      }
    };

    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserJobsApplied();
        setJobsApplied(data.totalApplications);
      } catch (error) {
        console.error('Failed to fetch jobs applied data:', error);
        setJobsApplied(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchAchievementsData();
    fetchStreakData();
  }, []);

  const totalXP = userProfile?.xp || 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const currentXP = totalXP % 100;
  const nextLevelXP = 100;

  // Debug logging
  console.log('Debug XP Values:', {
    totalXP,
    currentLevel,
    currentXP,
    nextLevelXP,
    progressPercentage: (currentXP / nextLevelXP) * 100,
  });

  // Compute stats dynamically
  const completedAchievements = achievements.filter(a => a.completed).length;
  const statsData = [
    {
      value: jobsApplied, // This could be filled with jobs applied data if available
      label: 'Jobs Applied',
    },
    {
      value: completedAchievements.toString(),
      label: 'Achievements',
    },
  ];

  return (
    <div className="flex max-h-[600px] min-h-[600px] w-full max-w-[800px] flex-col overflow-hidden">
      <header className="flex w-full flex-shrink-0 items-center justify-between rounded-t-[20px] bg-white px-4 py-3">
        <img className="h-8 w-[100px] object-contain sm:h-11 sm:w-[120px]" alt="Logo" src="/JOBTRAX_blue.png" />

        <Button
          className="rounded-[20px] bg-[#0076ff] px-4 py-2 hover:bg-[#0076ff]/90 sm:px-6 sm:py-3"
          onClick={onBack}>
          <div className="text-lg font-semibold text-white [font-family:'Noto_Sans',Helvetica] sm:text-xl">Back</div>
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center gap-3 overflow-y-auto bg-white p-4 sm:p-6">
        <div className="flex w-full items-center justify-center">
          <h1 className="text-center text-xl font-semibold text-[#343232] [font-family:'Noto_Sans',Helvetica] sm:text-2xl">
            {loading ? 'Loading...' : userInfo?.name || 'Unknown User'}
          </h1>
        </div>

        <img className="h-24 w-24 object-contain sm:h-32 sm:w-32" alt="Profile" src="/popup/megaman.gif" />

        <div className="flex w-full items-center justify-center">
          <div className="text-center text-sm font-semibold text-[#9f9f9f] [font-family:'Noto_Sans',Helvetica] sm:text-base">
            {loading ? 'Invite Code : Loading...' : `Invite Code : ${userProfile?.invite_code || 'N/A'}`}
          </div>
        </div>

        <section className="flex w-full flex-col gap-2 py-2">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center">
              <h2 className="text-sm font-semibold text-[#343232] [font-family:'Noto_Sans',Helvetica] sm:text-base">
                Your progress
              </h2>
            </div>

            <div className="flex w-full items-center justify-between">
              <div className="text-lg font-bold text-[#0076ff] [font-family:'Noto_Sans',Helvetica] sm:text-xl">
                {loading ? 'LV.-- Job Hunter' : `LV.${currentLevel} Job Hunter`}
              </div>

              <div className="text-sm font-normal text-[#9f9f9f] [font-family:'Noto_Sans',Helvetica] sm:text-base">
                {loading ? '--/--XP' : `${currentXP}/${nextLevelXP}XP`}
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Custom progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 sm:h-3">
              <div
                className="h-full bg-[#0076ff] transition-all duration-300 ease-out"
                style={{
                  width: loading ? '0%' : `${Math.max(0, Math.min(100, (currentXP / nextLevelXP) * 100))}%`,
                }}
              />
            </div>
          </div>
        </section>

        <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
          {statsData.map((stat, index) => (
            <Card key={index} className="flex-1 rounded-[20px] border-0 bg-[#e7f4fd]">
              <CardContent className="flex flex-col items-center justify-center gap-1 p-3 sm:gap-2 sm:p-4">
                <div className="text-center text-4xl font-bold text-[#0076ff] [font-family:'Noto_Sans',Helvetica] sm:text-5xl">
                  {loading || achievementsLoading ? '--' : stat.value}
                </div>

                <div className="w-full">
                  <div className="text-center text-sm font-semibold text-[#0076ff] [font-family:'Noto_Sans',Helvetica] sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="flex w-full flex-col py-3 sm:py-4">
          <div className="flex w-full items-center">
            <h2 className="text-lg font-semibold text-[#343232] [font-family:'Noto_Sans',Helvetica] sm:text-xl">
              Your achievement
            </h2>
          </div>
        </section>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          {achievementsLoading ? (
            // Loading skeleton for achievements
            <div className="flex w-full flex-col gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="flex w-full flex-col gap-3 p-3 sm:p-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex-1 pr-2">
                      <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="h-2 w-full animate-pulse rounded bg-gray-200"></div>
                  {index < 2 && <Separator className="w-full" />}
                </div>
              ))}
            </div>
          ) : achievements.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-[#9f9f9f]">No achievements available</span>
            </div>
          ) : (
            achievements.map((achievement, index) => (
              <div key={`achievement-${index}`} className="flex w-full flex-col gap-3 p-3 sm:p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex-1 pr-2">
                    <div
                      className={`text-sm font-semibold leading-tight [font-family:'Noto_Sans',Helvetica] sm:text-base ${
                        achievement.completed ? 'text-[#9f9f9f]' : 'text-[#343232]'
                      }`}>
                      {achievement.description}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div
                      className={`text-sm font-semibold [font-family:'Noto_Sans',Helvetica] sm:text-base ${
                        achievement.completed ? 'text-[#9f9f9f]' : 'text-[#0076ff]'
                      }`}>
                      {achievement.xp}XP
                    </div>
                  </div>
                </div>

                <Progress
                  value={achievement.completed ? 100 : 0}
                  className={`h-2 w-full sm:h-3 ${achievement.completed ? 'bg-neutral-200' : 'bg-[#e7f4fd]'}`}
                />

                {index < achievements.length - 1 && <Separator className="w-full" />}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
