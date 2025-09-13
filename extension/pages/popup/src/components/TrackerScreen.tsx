import React, { useState, useEffect } from 'react';
import JobList, { Job } from './JobList';

const categories = ['All', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

// Example: Replace with backend API call
const mockData = {
  streak: 12,
  userLevel: 1,
  userTitle: 'Job Hunter',
  jobs: [
    { company: 'Jump Trading', status: 'Applied', date: '09/12/25' },
    { company: 'theTradeDesk', status: 'Rejected', date: '09/11/25' },
    { company: 'Stripe', status: 'Interview', date: '09/10/25' },
    { company: 'Roblox', status: 'Offer', date: '09/09/25' },
    { company: 'Bloomberg', status: 'Applied', date: '09/08/25' },
  ],
};

const TrackerScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [streak, setStreak] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userTitle, setUserTitle] = useState('');

  useEffect(() => {
    // Replace with backend fetch
    setJobs(mockData.jobs);
    setStreak(mockData.streak);
    setUserLevel(mockData.userLevel);
    setUserTitle(mockData.userTitle);
  }, []);

  const filteredJobs =
    selectedCategory === 'All' ? jobs : jobs.filter(job => job.status.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="flex w-full max-w-[571px] flex-col items-start rounded-2xl">
      {/* Header */}
      <div className="bg-Background flex w-full items-center justify-between overflow-hidden rounded-t-2xl px-6 py-2">
        <img className="h-11 w-28" src="https://placehold.co/120x44" alt="Logo" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="text-Brand-Color text-base font-bold leading-7">LV.{userLevel}</div>
            <div className="text-Brand-Color text-base font-bold leading-7">{userTitle}</div>
          </div>
          <div className="relative h-14 w-14 rounded-lg">
            <img className="absolute h-14 w-14" src="https://placehold.co/56x56" alt="Avatar" />
          </div>
        </div>
      </div>
      {/* Streak Section */}
      <div className="bg-Brand-Accent flex w-full flex-col items-center overflow-hidden p-6">
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-center justify-between">
            <div className="text-Brand-Color text-2xl font-semibold">You’ve applied jobs for</div>
            <div className="bg-Brand-Color flex items-center gap-2.5 rounded-2xl px-6 py-4">
              <div className="text-Text-on-BG text-base font-semibold">Friends & Rankings</div>
            </div>
          </div>
          <div className="mt-4 flex w-full items-center justify-center gap-20">
            <div className="flex w-36 flex-col items-start gap-1">
              <div className="text-Brand-Color text-8xl font-bold leading-[96px]">{streak}</div>
              <div className="text-Brand-Color text-2xl font-semibold">streak days</div>
            </div>
            {/* Streak days UI, can be made dynamic */}
            <div className="flex items-center gap-6">
              {['Su', 'Sa', 'M', 'Tu', 'W'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className="text-Text-Primary w-6 text-base font-bold">{day}</div>
                  <div className={`relative h-8 w-8 ${idx < 3 ? 'bg-Brand-Color' : 'bg-Gray-Surface'} rounded-full`}>
                    {idx < 3 && (
                      <div className="outline-Surface absolute left-[10px] top-[12px] h-2.5 w-3 outline outline-4 outline-offset-[-2px]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Tracker Section */}
      <div className="bg-Background flex w-full flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-start gap-4">
          <div className="text-Text-Primary text-2xl font-semibold">Job applications tracker</div>
        </div>
        {/* Category Tabs */}
        <div className="flex items-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              className={`bg-Surface min-w-16 rounded-full px-3 py-1.5 outline outline-1 outline-offset-[-1px] ${selectedCategory === cat ? 'outline-Brand-Color' : 'outline-Border'} flex items-center`}
              onClick={() => setSelectedCategory(cat)}>
              <div className="text-Text-Primary text-base">{cat}</div>
            </button>
          ))}
        </div>
        {/* Job List */}
        <JobList jobs={filteredJobs} />
      </div>
    </div>
  );
};

export default TrackerScreen;
