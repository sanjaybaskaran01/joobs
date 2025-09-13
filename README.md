
# JobTrax 🚀  
*A gamified job application tracker to keep students motivated and engaged during their career search.*

![JobTrax Demo](https://github.com/sanjaybaskaran01/joobs/blob/main/logos/pixel_3d_megaman.gif?raw=true)

---

## Prototype

<video controls width="640" autoplay>
  <source src="./demo/prototype.mov"  >
  Your browser does not support the video tag. Download the demo: <a href="./demo/prototype.mov">demo/prototype.mov</a>
</video>


## Demo Deck

<a href="./demo/deck.pdf">demo/deck.pdf</a>




## 🎨 Design System

[![Figma Design](https://via.placeholder.com/800x450/f3f4f6/374151?text=JobTrax+Design+System)](https://www.figma.com/design/wXLhpMAoLp2d2rDrRd2NEA/JOOBS--Copy-?node-id=2001-9549)

> **[📱 View Interactive Figma Prototype →](https://www.figma.com/design/wXLhpMAoLp2d2rDrRd2NEA/JOOBS--Copy-?node-id=2001-9549)**


<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/wXLhpMAoLp2d2rDrRd2NEA/JOOBS--Copy-?page-id=2001%3A9491&node-id=2001-9549&p=f&viewport=185%2C-330%2C0.18&scaling=contain&content-scaling=fixed&starting-point-node-id=2001%3A9549&show-proto-sidebar=1&embed-host=share" allowfullscreen></iframe>


## 📖 Overview  
Applying for jobs can be stressful, repetitive, and demotivating. **JobTrax** transforms the process into a game by rewarding consistency, effort, and progress.  

**JobTrax** is a comprehensive Chrome extension with a Node.js backend that automatically tracks job applications through Gmail integration and AI-powered email parsing. The platform gamifies the job search experience with:

- **Automated Gmail Integration**: Seamlessly connects to your Gmail to fetch and parse job application emails using Google OAuth
- **AI-Powered Email Parsing**: Uses Claude API to intelligently extract job details, company names, and application statuses from emails
- **Gamification System**: Earn XP, unlock achievements, and maintain streaks to stay motivated
- **Social Features**: Add friends, compare progress, and celebrate milestones together
- **Real-time Tracking**: Live application status updates with detailed progress visualization
- **Chrome Extension Interface**: Beautiful, intuitive popup interface accessible from any webpage

This multiplayer gamified approach makes an intimidating process more engaging, encourages persistence, and keeps users accountable throughout their job hunt journey.

---

## 🎯 Key Features  

### 🔐 Authentication & Integration
- **Google OAuth Flow**: Secure authentication with Google accounts for Gmail access
- **Gmail API Integration**: Real-time email fetching and parsing with proper token management

### 📧 Email Processing & AI
- **Intelligent Email Parsing**: Claude API integration to extract job details from application emails
- **Status Detection**: AI-powered detection of application statuses (applied, OA, interview, offer, rejected)
- **Email Content Analysis**: Parsing of email content, attachments, and metadata

### 🎮 Gamification System
- **XP & Leveling**: Experience points system with dynamic level calculation
- **Achievement System**: Comprehensive achievement tracking with completion status
- **Streak Tracking**: Daily application streaks with visual progress indicators
- **Progress Visualization**: Interactive chart showing application trends

### 👥 Social Features
- **Friend System**: Add friends using invite codes and view their progress
- **Leaderboards**: Compare XP, streaks, and achievements with friends
- **Profile Management**: User profiles with customizable information
- **Social Progress Tracking**: View friends' application charts and statistics

### 🖥️ Chrome Extension Interface
- **Popup Interface**: Clean, modern popup with multiple screens (Home, Friends, Profile, Add Friend)
- **Responsive Design**: Optimized UI for Chrome extension popup dimensions
- **Navigation System**: Intuitive navigation between different feature screens

### 📊 Data Management
- **Firestore Integration**: Cloud-based data storage for applications, users, and achievements
- **Application Status Tracking**: Comprehensive status management with filtering options
- **Chart Data Generation**: Cumulative application tracking with date-based analytics 

---

## 🏆 Achievements  
Achievements are dynamically loaded from Firestore and cover multiple categories:  

- **Milestones**: First Application, Ten Total, Hundred Club  
- **Consistency**: Five in a Day, Weekend Warrior  
- **Streaks**: 3-day, 7-day, 14-day, 30-day streaks  
- **Application Quality**: First Interview, Technical Challenger, Offer Received  
- **Engagement**: Early Bird, Night Owl  

Each achievement grants XP, helping users level up in their job hunt journey.  

---

## 🛠️ Tech Stack  

### Backend
- **Runtime**: Node.js 22+ with TypeScript
- **Framework**: Express.js with middleware (CORS)
- **Authentication**: Firebase SDK + Google OAuth 2.0
- **Database**: Firebase Firestore (NoSQL document DB)
- **Email Processing**: Gmail API with Google APIs client library
- **AI Integration**: Claude API (Anthropic) for intelligent email parsing
- **Development**: ts-node-dev for hot reloading

### Frontend (Chrome Extension)
- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite with custom Chrome extension configuration
- **Styling**: Tailwind CSS with custom component library
- **State Management**: React hooks with Chrome storage API
- **HTTP Client**: Axios with interceptors for authentication
- **UI Components**: Custom component library with Lucide React icons
- **UI/UX Tools**: Figma
- **Package Manager**: pnpm

### Development & Build Tools
- **Monorepo Management**: Turbo for build orchestration
- **Linting**: ESLint with TypeScript and React rules
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Checking**: TypeScript with strict configuration

### Chrome Extension Architecture
- **Manifest**: Manifest V3 with comprehensive permissions
- **Content Scripts**: Multiple content script bundles for different websites
- **Background Service Worker**: Token management and API communication
- **Popup Interface**: Multi-screen React application
- **Storage**: Chrome storage API for token persistence locally
- **Permissions**: Gmail access, notifications, side panel, and scripting  

---

## 📂 Project Structure  
```
JobTrax/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.ts     # Firebase Admin SDK configuration
│   │   │   └── google.ts       # Google OAuth & Gmail API setup
│   │   ├── middleware/
│   │   │   ├── auth.ts         # Firebase token validation middleware
│   │   │   └── errorHandler.ts # Global error handling
│   │   ├── routes/
│   │   │   ├── auth.ts         # Google OAuth flow & token management
│   │   │   ├── refresh.ts      # Application refresh & AI parsing
│   │   │   └── userInfo.ts     # User data, friends, achievements
│   │   ├── services/
│   │   │   ├── authService.ts  # Firebase custom token creation
│   │   │   └── gmailService.ts # Gmail API integration & email parsing
│   │   └── index.ts            # Express server entry point
│   ├── dist/                   # Compiled TypeScript output
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration
│
├── extension/                  # Chrome Extension (React + Vite)
│   ├── pages/
│   │   └── popup/             # Main extension popup
│   │       └── src/
│   │           ├── components/ # Reusable UI components
│   │           ├── screens/    # Main application screens
│   │           │   ├── Home.tsx
│   │           │   ├── Friends.tsx
│   │           │   ├── Profile.tsx
│   │           │   └── AddFriend.tsx
│   │           ├── sections/   # Feature-specific sections
│   │           │   ├── Header.tsx
│   │           │   ├── JobApplications.tsx
│   │           │   └── ApplicationStatus.tsx
│   │           ├── api/        # API client & endpoints
│   │           └── Popup.tsx   # Main popup component
│   ├── packages/              # Shared packages & utilities
│   │   ├── shared/            # Common utilities
│   │   ├── ui/                # UI component library
│   │   ├── storage/           # Chrome storage utilities
│   │   └── ...                # Other shared packages
│   ├── dist/                  # Built extension files
│   ├── chrome-extension/      # Extension-specific config
│   └── package.json           # Extension dependencies
│
└── README.md                  # This file
```

---

## 🔑 API Endpoints  

### Authentication Routes (`/auth`)
- **`GET /auth/google`** - Initiates Google OAuth flow
- **`GET /auth/google/callback`** - Handles OAuth callback and creates Firebase custom token
- **`POST /auth/refresh`** - Refreshes Google access tokens
- **`POST /auth/logout`** - Logs out user and revokes tokens

### Application Management (`/api/v1`)
- **`POST /api/v1/refresh/applications`** - Main application refresh endpoint
  - Fetches new Gmail emails since last refresh
  - Parses job application details via Claude API
  - Updates Firestore with new/updated applications
  - Reprocesses achievements & XP
  - **Auth**: Bearer token (Firebase ID token)

### User Data (`/api/v1`)
- **`GET /api/v1/user_details`** - Get user profile (XP, invite code, name)
- **`POST /api/v1/user_chart`** - Get user's application chart data (cumulative)
- **`GET /api/v1/achievements`** - Get user's achievements with completion status
- **`POST /api/v1/jobs_applied_dates`** - Get application dates and streak data

### Social Features (`/api/v1`)
- **`GET /api/v1/friends`** - Get user's friends list with XP and streak data
- **`POST /api/v1/add_friend`** - Add friend using invite code
- **`GET /api/v1/friend_user_chart`** - Get friend's application chart data

### Application Status (`/api/v1`)
- **`GET /api/v1/application_status`** - Get detailed application statuses with filtering
- **`POST /api/v1/refresh_applications`** - Force refresh application statuses

Auth required: Bearer token (Firebase ID token).  

---

## ⚡ Setup Instructions  

### Prerequisites  
- Node.js 22+  
- Firebase Project & Service Account JSON  
- Gmail API
- Anthropic Claude API Key  

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:  
```env
# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Claude API
CLAUDE_API_KEY=your-anthropic-claude-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

Run the backend:
```bash
npm run dev
```

### 4. Chrome Extension Setup
```bash
cd extension
pnpm install
```

Create environment configuration:
```bash
# Copy environment template
cp packages/env/.env.example packages/env/.env
```

Update the environment file with your backend URL:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Build the extension:
```bash
pnpm build
```

### 5. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension/dist/` folder
5. The JobTrax extension should now appear in your extensions list

### 6. First Time Setup
1. Click the JobTrax extension icon in your Chrome toolbar
2. Click "Sign in with Google" to authenticate
3. Grant Gmail permissions when prompted
4. The extension will automatically start tracking your job applications!

### Development Commands
```bash
# Backend development
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start           # Run production build

# Extension development  
cd extension
pnpm dev            # Start development with hot reload
pnpm build          # Build for production
pnpm lint           # Run linting
pnpm type-check     # Run TypeScript checks
```  

---

## 🎮 Track Submission: Games & Gamification  
Our goal is to keep students motivated during the stressful job application process. JobTrax transforms job hunting into a game with achievements, streaks, and XP that reward persistence and progress. By connecting with friends, users can view each other’s milestones and encourage one another, turning the process into a multiplayer challenge. This gamified, social approach makes job hunting less intimidating and keeps students consistently engaged.  

---

## 🚧 Roadmap  

### ✅ Completed Features
- [x] Gmail API integration with OAuth authentication
- [x] AI-powered email parsing with Claude API
- [x] Chrome extension with React interface
- [x] Firebase authentication and Firestore integration
- [x] Friend system with invite codes
- [x] Achievement system with XP tracking
- [x] Application status tracking and filtering
- [x] Streak tracking and progress visualization

### 🔄 In Progress
- [ ] Enhanced achievement system with more categories
- [ ] Improved email parsing accuracy
- [ ] Performance optimizations for large email volumes

### 📋 Planned Features
- [ ] Web dashboard alongside Chrome extension
- [ ] Advanced analytics and insights
- [ ] Email templates and application tracking
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Mobile app companion
- [ ] Team/group challenges and competitions
- [ ] Export functionality for application data
- [ ] Advanced filtering and search capabilities  

---

## 🔧 Development

### Architecture Overview
JobTrax follows a modern microservices-inspired architecture with clear separation of concerns:

- **Backend**: RESTful API built with Express.js and TypeScript
- **Frontend**: Chrome Extension with React and modern build tools
- **Database**: Firebase Firestore for real-time data synchronization
- **Authentication**: OAuth 2.0 flow with Firebase custom tokens
- **AI Integration**: Claude API for intelligent email parsing

### Key Design Decisions
- **Chrome Extension First**: Chosen for seamless Gmail integration and user convenience
- **Firebase Backend**: Provides real-time updates and scalable authentication
- **TypeScript Throughout**: Ensures type safety across the entire stack
- **Modular Architecture**: Clean separation between authentication, data processing, and UI

### Performance Considerations
- **Lazy Loading**: Extension components load on-demand
- **Caching**: Chrome storage API for token persistence
- **Advanced state management**: Efficient API fetching and caching using Tanstack Query and Zustand
- **Batch Processing**: Efficient email parsing and database updates
- **Real-time Updates**: Firestore listeners for live data synchronization

---

## 👥 Team  
**HackCMU 2025 Project** – Built with ☕ and ⚡

*Transforming job hunting from a chore into a game, one application at a time.*  
