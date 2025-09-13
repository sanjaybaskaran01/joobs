# Joobs - Gamified Job Application Tracker

A Chrome extension that gamifies the job application process with achievements, streaks, and XP tracking. Automatically detects job-related emails from Gmail and provides a motivating dashboard to track your job search progress.

## Features

- 🎯 **Gamified Dashboard**: XP system, levels, and achievements
- 🔥 **Application Streaks**: Track daily application consistency
- 📧 **Gmail Integration**: Auto-detect job-related emails
- 📊 **Job Status Tracking**: Applied, OA, Interview, Offer, Rejected
- 🏆 **Achievement System**: Unlock rewards for milestones
- 📱 **Clean UI**: Simple, motivating interface

## Project Structure

```
React-Chrome-Extension-Template/
├── manifest.json                 # Chrome extension manifest
├── package.json                 # Dependencies and scripts
├── public/
│   ├── index.html              # Extension popup HTML
│   └── icons/                  # Extension icons
├── src/
│   ├── App.js                  # Main React component
│   ├── App.css                 # Main styles
│   ├── components/             # React components
│   │   ├── Dashboard.js        # Main dashboard
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── JobList.js          # Job applications list
│   │   ├── JobList.css         # Job list styles
│   │   ├── Achievements.js     # Achievements display
│   │   └── Achievements.css    # Achievement styles
│   ├── api/                    # API integration
│   │   └── jobsAPI.js          # Backend API service
│   ├── data/                   # Sample data
│   │   └── sampleData.js       # Mock data for development
│   ├── utils/                  # Utility functions
│   │   └── jobUtils.js         # Job tracking utilities
│   └── content-script.js       # Gmail integration script
└── README.md                   # This file
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build-extension
```

### 3. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select the `build` folder
4. The extension should now appear in your Chrome toolbar

### 4. Development Mode
For continuous development:
```bash
npm run watch
```
This will rebuild the extension when files change.

## API Integration

The extension is designed to work with a backend API. Here's the expected API structure:

### Backend API Endpoints

#### Authentication
- `POST /api/auth/gmail` - Gmail OAuth integration
- `GET /api/auth/user` - Get current user info

#### Job Applications
- `GET /api/jobs` - Get all job applications
- `POST /api/jobs` - Create new job application
- `PUT /api/jobs/:id` - Update job application
- `DELETE /api/jobs/:id` - Delete job application

#### User Stats & Gamification
- `GET /api/stats` - Get user statistics (XP, streak, etc.)
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements/unlock` - Unlock new achievement

#### Email Processing
- `POST /api/emails/parse` - Parse job-related email content
- `GET /api/emails/sync` - Sync Gmail emails

### Data Models

#### Job Application
```javascript
{
  id: string,
  company: string,
  position: string,
  status: 'applied' | 'oa' | 'interview' | 'offer' | 'rejected',
  appliedDate: string (ISO date),
  lastUpdated: string (ISO date),
  salaryRange: string,
  location: string,
  xpEarned: number,
  source: 'manual' | 'gmail_auto'
}
```

#### User Stats
```javascript
{
  totalXP: number,
  currentLevel: number,
  xpToNextLevel: number,
  currentStreak: number,
  longestStreak: number,
  totalApplications: number,
  interviews: number,
  offers: number,
  rejections: number
}
```

#### Achievement
```javascript
{
  id: string,
  title: string,
  description: string,
  icon: string,
  unlocked: boolean,
  unlockedDate?: string,
  xpReward: number
}
```

## Gmail Integration

The content script (`content-script.js`) automatically:
- Scans Gmail for job-related emails
- Extracts company, position, and status information
- Sends data to the extension for processing
- Works with popular job sites and company domains

### Supported Email Types
- Application confirmations
- Interview invitations
- Online assessment notifications
- Offer letters
- Rejection emails

## Gamification System

### XP System
- **Applied**: 25 XP
- **Online Assessment**: 40 XP
- **Interview**: 75 XP
- **Offer**: 150 XP
- **Rejection**: 15 XP (participation points)

### Achievements
- **First Step**: Submit first application (50 XP)
- **Hot Streak**: 5 applications in one day (100 XP)
- **Interview Ready**: Land first interview (150 XP)
- **Consistency King**: 7-day application streak (200 XP)
- **Offer Collector**: Receive first offer (300 XP)
- **Application Master**: 50 total applications (500 XP)

## Development

### Sample Data
The extension includes sample data for development (`src/data/sampleData.js`). This will be replaced with real API calls once the backend is integrated.

### Chrome Storage
User data is stored using Chrome's storage API for persistence across sessions.

### Content Script Permissions
The extension requests:
- `activeTab`: Access current tab
- `storage`: Store user data
- `identity`: Gmail OAuth integration

## Next Steps

1. **Backend Development**: Create the API endpoints described above
2. **Gmail OAuth**: Implement proper Gmail authentication
3. **Claude API Integration**: Add email parsing with Claude
4. **Real-time Sync**: Implement automatic email scanning
5. **Enhanced UI**: Add more interactive elements and animations
6. **Export/Import**: Allow users to backup their data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own job tracking extension!
