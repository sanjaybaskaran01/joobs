import React from 'react';

export type Job = {
  company: string;
  status: string;
  date: string;
  logoUrl?: string;
};

export type JobListProps = {
  jobs: Job[];
};

const statusStyles: Record<string, string> = {
  Applied: 'bg-Brand-Accent text-Brand-Color',
  Interview: 'bg-Orange-Surface text-Orange-Text',
  Offer: 'bg-Green-Surface text-Green-Text',
  Rejected: 'bg-Gray-Surface text-Gray-Text',
};

const JobList: React.FC<JobListProps> = ({ jobs }) => (
  <div>
    {jobs.length === 0 ? (
      <div className="text-Text-Secondary w-full text-center text-lg">No applications in this category.</div>
    ) : (
      jobs.map(job => (
        <div key={job.company} className="flex flex-col items-center gap-6 overflow-hidden px-4 pt-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                className="border-Border h-14 w-14 rounded-lg border"
                src={job.logoUrl || 'https://placehold.co/60x60'}
                alt={job.company}
              />
              <div className="flex flex-col items-start gap-3">
                <div className="text-Text-Primary text-2xl font-semibold">{job.company}</div>
                <div className="flex items-center gap-2">
                  <div className="text-Text-Secondary text-xl">Last updated:</div>
                  <div className="text-Text-Secondary text-xl">{job.date}</div>
                </div>
              </div>
            </div>
            <div
              className={`flex h-10 items-center gap-1.5 rounded-full px-4 py-2 ${statusStyles[job.status] || 'bg-Brand-Accent text-Brand-Color'}`}>
              <div className="text-lg">{job.status}</div>
              <div className="h-4 w-4" />
            </div>
          </div>
          <div className="flex w-full flex-col items-start">
            <div className="bg-Divider h-px w-full" />
          </div>
        </div>
      ))
    )}
  </div>
);

export default JobList;
