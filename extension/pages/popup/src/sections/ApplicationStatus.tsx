import { ChevronRightIcon } from 'lucide-react';
import React, { JSX, useState } from 'react';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Separator } from '../components/separator';
import { useApplicationStatuses, useRefreshApplicationStatuses } from '../hooks/useApiQueries';

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Applied', value: 'applied' },
  { label: 'OA', value: 'oa' },
  { label: 'Interview', value: 'interview' },
  { label: 'Offer', value: 'offer' },
  { label: 'Rejected', value: 'rejected' },
];

type ApplicationData = {
  icon: string;
  company_name: string;
  last_updated: string;
  status: string;
  email_url: string;
};

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'applied':
      return 'bg-[#e7f4fd] text-[#0076ff]';
    case 'rejected':
      return 'bg-neutral-200 text-[#696e69]';
    case 'interview':
      return 'bg-[#ffe9d9] text-[#d0720c]';
    case 'offer':
      return 'bg-[#c8fed2] text-[#0c8e17]';
    case 'oa':
      return 'bg-[#fff3cd] text-[#856404]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const ApplicationStatusSection = (): JSX.Element => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { data: applicationsData, isLoading: loading } = useApplicationStatuses();
  const refreshMutation = useRefreshApplicationStatuses();
  
  const applications = applicationsData?.applications || [];

  const filteredAndSortedApplications = applications
    .filter(application => {
      if (selectedFilter === 'all') return true;
      return application.status.toLowerCase() === selectedFilter.toLowerCase();
    })
    .sort((a, b) => {
      // Sort by last_updated date in descending order (most recent first)
      const dateA = new Date(a.last_updated);
      const dateB = new Date(b.last_updated);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <section className="flex w-full flex-col items-start gap-3 bg-white p-4">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold leading-tight text-[#343232]">Job applications tracker</h1>
        
      </header>

      <nav className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
        {filterOptions.map(option => {
          const count =
            option.value === 'all'
              ? applications.length
              : applications.filter(app => app.status.toLowerCase() === option.value.toLowerCase()).length;

          return (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              onClick={() => setSelectedFilter(option.value)}
              className={`h-8 min-w-12 flex-shrink-0 justify-center gap-1 rounded-full border border-solid bg-white px-3 py-1 text-sm ${
                selectedFilter === option.value ? 'border-[#0076ff]' : 'border-[#e0e0e0]'
              } inline-flex items-center hover:bg-white`}>
              <span className="text-sm font-normal leading-tight text-[#343232]">
                {option.label}
                {!loading && count > 0 && <span className="ml-1 text-xs opacity-60">({count})</span>}
              </span>
            </Button>
          );
        })}
      </nav>

      <div className="flex max-h-64 w-full flex-col overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-[#9f9f9f]">Loading applications...</span>
          </div>
        ) : filteredAndSortedApplications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-[#9f9f9f]">
              {selectedFilter === 'all' ? 'No applications found' : `No ${selectedFilter} applications found`}
            </span>
          </div>
        ) : (
          filteredAndSortedApplications.map((application: ApplicationData, index: number) => (
            <article
              key={`${application.company_name}-${index}`}
              className="flex flex-col items-center justify-center gap-3 px-2 py-3">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="inline-flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-lg border border-solid border-[#e0e0e0] bg-cover bg-center bg-no-repeat flex items-center justify-center"
                  >
                    {application.icon ? (
                      <img
                        src={application.icon.startsWith('data:') ? application.icon : `data:image/png;base64,${application.icon}`}
                        alt={application.company_name + ' logo'}
                        className="h-12 w-12 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
                        <span className="text-xs font-semibold text-gray-500">
                          {application.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="inline-flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
                    <h2 className="w-full truncate text-base font-semibold leading-tight text-[#343232]">
                      {application.company_name}
                    </h2>

                    <div className="inline-flex items-center gap-1">
                      <span className="text-sm font-normal leading-tight text-[#9f9f9f]">
                        {(() => {
                          const d = new Date(application.last_updated);
                          const now = new Date();
                          const diff = now.getTime() - d.getTime();
                          const oneDay = 24 * 60 * 60 * 1000;
                          const isToday =
                            d.getFullYear() === now.getFullYear() &&
                            d.getMonth() === now.getMonth() &&
                            d.getDate() === now.getDate();
                          const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                          const isYesterday =
                            d.getFullYear() === yesterday.getFullYear() &&
                            d.getMonth() === yesterday.getMonth() &&
                            d.getDate() === yesterday.getDate();

                          const time = d.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          });

                          if (isToday) return `Today · ${time}`;
                          if (isYesterday) return `Yesterday · ${time}`;

                          const sameYear = d.getFullYear() === now.getFullYear();
                          const dateFmt = d.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            ...(sameYear ? {} : { year: 'numeric' }),
                          });

                          return `${dateFmt} · ${time}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <a href={application.email_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Badge
                    variant="secondary"
                    className={`inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-1 ${getStatusColor(application.status)} flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80`}>
                    <span className="whitespace-nowrap text-sm font-normal leading-tight">
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase()}
                    </span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Badge>
                </a>
              </div>

              {index < filteredAndSortedApplications.length - 1 && <Separator className="w-full" />}
            </article>
          ))
        )}
      </div>
    </section>
  );
};
