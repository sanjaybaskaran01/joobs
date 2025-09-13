import React, { JSX } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Button } from '../components/button';
import { Card, CardContent } from '../components/card';
import { Separator } from '../components/separator';
import { useUserChart, fetchUserFriends, fetchUserProfile, fetchUserJobsApplied, getUser, useUserFriends } from '../hooks/useApiQueries';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface FriendsProps {
  onBack: () => void;
  onNavigateToAddFriend: () => void;
}

export const Friends = ({ onBack, onNavigateToAddFriend }: FriendsProps): JSX.Element => {
  const [chartData, setChartData] = useState<{ x: string[]; y: number[] } | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [friends, setFriends] = useState<{ name: string; xp: number; streak: number }[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ xp: number; invite_code: string } | null>(null);
  const [userInfo, setUserInfo] = useState<{ uid: string; email: string; name: string } | null>(null);
  const [streakData, setStreakData] = useState<{ dates: string[]; streak: number } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        const data = await fetchUserChart();
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    };

    const fetchFriendsData = async () => {
      try {
        setFriendsLoading(true);
        const data = await fetchUserFriends();
        setFriends(data.friends);
      } catch (error) {
        console.error('Failed to fetch friends data:', error);
        setFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        
        // Fetch user profile (XP and invite code)
        const profileData = await fetchUserProfile();
        setUserProfile(profileData);

        // Fetch user info (name, email)
        const userData = await getUser();
        setUserInfo(userData);

        // Fetch streak data
        const jobsData = await fetchUserJobsApplied();
        setStreakData(jobsData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Set default values if API fails
        setUserProfile({ xp: 0, invite_code: 'N/A' });
        setUserInfo(null);
        setStreakData({ dates: [], streak: 0 });
      } finally {
        setUserLoading(false);
      }
    };

    fetchChartData();
    fetchFriendsData();
    fetchUserData();
  }, []);

  // Format dates for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Prepare chart data
  const lineChartData = chartData
    ? {
        labels: chartData.x.map(date => formatDate(date)),
        datasets: [
          {
            label: 'Applications',
            data: chartData.y,
            borderColor: '#0076ff',
            backgroundColor: 'rgba(0, 118, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0076ff',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#0076ff',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const originalDate = chartData?.x[context[0].dataIndex];
            return originalDate
              ? new Date(originalDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';
          },
          label: (context: any) => `Applications: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9f9f9f',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(159, 159, 159, 0.2)',
        },
        ticks: {
          color: '#9f9f9f',
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Generate level from XP (same logic as in Profile)
  const getLevel = (xp: number) => Math.floor(xp / 100) + 1;

  // Transform API data to display format
  const friendsData = friends.map(friend => ({
    name: friend.name,
    level: `LV.${getLevel(friend.xp)} Job Hunter`,
    streakDays: `${friend.streak} streak days`,
    avatar: '/icon.svg', // Default avatar, could be made dynamic later
  }));

  // User data for the "You" section
  const userXP = userProfile?.xp || 0;
  const userLevel = getLevel(userXP);
  const userStreak = streakData?.streak || 0;
  const userName = userInfo?.name || 'You';

  return (
    <div className="flex w-full min-w-[350px] flex-col">
      <header className="flex w-full items-center justify-between rounded-t-[20px] border-b border-gray-100 bg-white px-4 py-3">
        <img className="h-9 w-24" alt="Logo" src="/popup/logo.png" />

        <Button className="h-auto rounded-[16px] bg-[#0076ff] px-4 py-2 hover:bg-[#0066dd]" onClick={onBack}>
          <div className="whitespace-nowrap text-base font-semibold leading-tight text-white">Back</div>
        </Button>
      </header>

      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
        {chartLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm font-medium text-[#0076ff]">Loading chart...</div>
          </div>
        ) : lineChartData ? (
          <div className="h-full p-4">
            <div className="relative h-full">
              <div className="absolute left-0 top-0 z-10">
                <h3 className="mb-1 text-sm font-semibold text-[#0076ff]">Your Application Progress</h3>
                <p className="text-xs text-[#9f9f9f]">Applications over time</p>
              </div>
              <div className="h-full pt-8">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-[#9f9f9f]">No chart data available</div>
              <div className="mt-1 text-xs text-[#9f9f9f]">Start applying to see your progress!</div>
            </div>
          </div>
        )}
      </div>

      <Card className="w-full rounded-none border-0 bg-white">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="flex w-full items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/icon.svg" alt={userName} />
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col items-start justify-center">
                <div className="text-lg font-semibold leading-tight text-[#0076ff]">
                  {userLoading ? 'Loading...' : userName}
                </div>

                <div className="text-sm font-bold leading-tight text-[#9f9f9f]">
                  {userLoading ? 'LV.-- Job Hunter' : `LV.${userLevel} Job Hunter`}
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-base font-semibold leading-tight text-[#0076ff]">
                  {userLoading ? '-- streak days' : `${userStreak} streak days`}
                </div>
              </div>
            </div>
          </div>

          <Separator className="w-full" />
        </CardContent>
      </Card>

      <Card className="flex max-h-64 w-full flex-col items-center gap-3 overflow-y-auto rounded-none border-0 bg-white p-4">
        <CardContent className="w-full p-0">
          <div className="sticky top-0 z-10 mb-3 flex w-full items-center justify-between bg-white py-2">
            <div className="text-lg font-semibold leading-tight text-[#343232]">Friends &amp; Rankings</div>

            <Button
              onClick={onNavigateToAddFriend}
              className="h-auto rounded-[16px] border border-solid border-[#0076ff] bg-white px-4 py-2 hover:bg-gray-50">
              <div className="whitespace-nowrap text-sm font-semibold leading-tight text-[#0076ff]">Add a friend</div>
            </Button>
          </div>

          {friendsLoading ? (
            // Loading skeleton for friends
            <div className="flex w-full flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="flex w-full items-center gap-3 px-2 py-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          ) : friendsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-[#9f9f9f] text-sm mb-2">No friends yet</div>
              <div className="text-[#9f9f9f] text-xs">Add friends to see their progress!</div>
            </div>
          ) : (
            friendsData.map((friend, index) => (
              <div key={friend.name} className="flex w-full flex-col items-center justify-center gap-3 px-2 py-3">
                <div className="flex w-full items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                      <div className="w-full truncate text-base font-semibold leading-tight text-[#343232]">
                        {friend.name}
                      </div>

                      <div className="text-sm font-bold leading-tight text-[#9f9f9f]">{friend.level}</div>
                    </div>

                    <div className="flex flex-shrink-0 items-center">
                      <div className="whitespace-nowrap text-sm font-semibold leading-tight text-[#0076ff]">
                        {friend.streakDays}
                      </div>
                    </div>
                  </div>
                </div>

                {index < friendsData.length - 1 && <Separator className="w-full" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
