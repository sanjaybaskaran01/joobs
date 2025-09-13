import { CheckCircleIcon } from 'lucide-react';
import  { JSX, useState, useEffect } from 'react';
import { Button } from '../components/button';
import { fetchUserJobsApplied } from '../api/api';

interface JobApplicationsTrackerSectionProps {
  onNavigateToFriends: () => void;
}

export const JobApplicationsTrackerSection = ({
  onNavigateToFriends,
}: JobApplicationsTrackerSectionProps): JSX.Element => {
  const [streakData, setStreakData] = useState<{ dates: string[]; currentStreak: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserJobsApplied();
        setStreakData(data);
      } catch (error) {
        console.error('Failed to fetch jobs applied data:', error);
        // Set default values if API fails
        setStreakData({ dates: [], currentStreak: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  // Get rotating 5-day view with today in the middle
  const getRotatingWeekDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDays = [];

    // Create 5 days: 2 days before today, today, 2 days after today
    for (let i = -2; i <= 2; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);

      const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayName = dayNames[dayOfWeek];

      // Format date as YYYY-MM-DD to match API format
      const dateString = dayDate.toISOString().split('T')[0];

      // Check if any job was applied on this day
      const hasApplication = streakData?.dates.includes(dateString) || false;

      weekDays.push({
        day: dayName,
        completed: hasApplication,
        date: dayDate,
        dateString: dateString,
        isToday: i === 0,
      });
    }

    return weekDays;
  };

  const weekDays = streakData ? getRotatingWeekDays() : [];

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#e7f4fd] p-4">
      <div className="flex w-full flex-col items-start justify-center">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold leading-tight text-[#0076ff]">You&apos;ve applied jobs for</h2>

          <Button
            className="inline-flex h-auto items-center justify-center gap-1.5 rounded-[16px] bg-[#0076ff] px-4 py-2 hover:bg-[#0066dd]"
            onClick={onNavigateToFriends}>
            <span className="whitespace-nowrap text-sm font-semibold leading-tight text-white">
              Friends &amp; Rankings
            </span>
          </Button>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-shrink-0 flex-col items-start justify-center gap-1">
            <div className="text-5xl font-bold leading-tight text-[#0076ff]">
              {loading ? '--' : streakData?.currentStreak || 0}
            </div>

            <div className="text-lg font-semibold leading-tight text-[#0076ff]">streak days</div>
          </div>

          <div className="inline-flex flex-shrink-0 items-center gap-3">
            {loading
              ? // Show skeleton loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={`loading-${index}`} className="inline-flex flex-col items-center gap-1.5">
                    <div className="w-6 text-center text-sm font-bold leading-tight text-[#343232]">--</div>
                    <div className="h-7 w-7 animate-pulse rounded-full bg-neutral-200" />
                  </div>
                ))
              : weekDays.map((dayData: any, index: number) => (
                  <div
                    key={`day-${dayData.day}-${dayData.dateString}`}
                    className="inline-flex flex-col items-center gap-1.5"
                    title={`${dayData.day} ${dayData.date.toLocaleDateString()} - ${dayData.completed ? 'Job applied' : 'No application'}${dayData.isToday ? ' (Today)' : ''}`}>
                    <div
                      className={`w-8 text-center text-sm font-bold leading-tight ${
                        dayData.isToday ? 'rounded bg-[#e7f4fd] px-1 text-[#0076ff]' : 'text-[#343232]'
                      }`}>
                      {dayData.day}
                    </div>

                    {dayData.completed ? (
                      <CheckCircleIcon className="h-7 w-7 text-[#0076ff]" />
                    ) : (
                      <div
                        className={`h-7 w-7 rounded-full ${
                          dayData.isToday ? 'border-2 border-[#0076ff] bg-[#e7f4fd]' : 'bg-neutral-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};
