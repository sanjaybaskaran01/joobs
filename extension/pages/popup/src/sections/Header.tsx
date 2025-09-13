import React, { JSX, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { fetchUserProfile } from '../api/api';

interface HeaderSectionProps {
  onNavigateToProfile: () => void;
}

const lvlCategories = [
  { level: 1, title: 'Newbie' },
  { level: 5, title: 'Apprentice' },
  { level: 10, title: 'Intermediate' },
];

export const HeaderSection = ({ onNavigateToProfile }: HeaderSectionProps): JSX.Element => {
  const [userProfile, setUserProfile] = useState<{ xp: number; invite_code: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setUserProfile(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Set default values if API fails
        setUserProfile({ xp: 0, invite_code: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="flex w-full items-center justify-between rounded-t-[20px] border-b border-gray-100 bg-white px-4 py-3">
      <img className="h-9 w-24" alt="Logo" src="/popup/logo.png" />

      <div className="inline-flex items-center justify-end gap-2">
        <div className="inline-flex items-center gap-1.5">
          <div className="text-base font-bold leading-tight text-[#0076ff]">
            {loading ? 'LV.--' : `LV.${Math.floor((userProfile?.xp || 0) / 100)}`}
          </div>

          <div className="text-base font-bold leading-tight text-[#0076ff]">Job Hunter</div>
        </div>

        <Avatar className="h-12 w-12 cursor-pointer transition-opacity hover:opacity-80" onClick={onNavigateToProfile}>
          <AvatarImage src="/icon.svg" alt="User avatar" />
          <AvatarFallback>JH</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
