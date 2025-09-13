import  { JSX } from 'react';
import { ApplicationStatusSection } from '../sections/ApplicationStatus';
import { HeaderSection } from '../sections/Header';
import { JobApplicationsTrackerSection } from '../sections/JobApplications';

interface HomeProps {
  onNavigateToFriends: () => void;
  onNavigateToProfile: () => void;
}

export const Home = ({ onNavigateToFriends, onNavigateToProfile }: HomeProps): JSX.Element => {
  return (
    <div className="flex w-full min-w-[350px] flex-col">
      <HeaderSection onNavigateToProfile={onNavigateToProfile} />
      <JobApplicationsTrackerSection onNavigateToFriends={onNavigateToFriends} />
      <ApplicationStatusSection />
    </div>
  );
};
