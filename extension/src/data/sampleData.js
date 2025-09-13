// Sample data for development - replace with API calls later
export const sampleJobApplications = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer",
    status: "interview",
    appliedDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    salaryRange: "$120K - $180K",
    location: "Mountain View, CA",
    xpEarned: 50
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Frontend Developer",
    status: "applied",
    appliedDate: "2024-01-18",
    lastUpdated: "2024-01-18",
    salaryRange: "$100K - $150K",
    location: "Seattle, WA",
    xpEarned: 25
  },
  {
    id: 3,
    company: "Meta",
    position: "Full Stack Developer",
    status: "oa", // Online Assessment
    appliedDate: "2024-01-10",
    lastUpdated: "2024-01-16",
    salaryRange: "$130K - $200K",
    location: "Menlo Park, CA",
    xpEarned: 40
  },
  {
    id: 4,
    company: "Apple",
    position: "iOS Developer",
    status: "offer",
    appliedDate: "2024-01-05",
    lastUpdated: "2024-01-25",
    salaryRange: "$140K - $190K",
    location: "Cupertino, CA",
    xpEarned: 100
  },
  {
    id: 5,
    company: "Netflix",
    position: "Backend Engineer",
    status: "rejected",
    appliedDate: "2024-01-12",
    lastUpdated: "2024-01-22",
    salaryRange: "$110K - $160K",
    location: "Los Gatos, CA",
    xpEarned: 15
  }
];

export const sampleUserStats = {
  totalXP: 1250,
  currentLevel: 5,
  xpToNextLevel: 150,
  currentStreak: 7,
  longestStreak: 12,
  totalApplications: 23,
  interviews: 4,
  offers: 2,
  rejections: 8
};

export const sampleAchievements = [
  {
    id: 1,
    title: "First Step",
    description: "Submit your first job application",
    icon: "🎯",
    unlocked: true,
    unlockedDate: "2024-01-05",
    xpReward: 50
  },
  {
    id: 2,
    title: "Hot Streak",
    description: "Apply to 5 jobs in one day",
    icon: "🔥",
    unlocked: true,
    unlockedDate: "2024-01-15",
    xpReward: 100
  },
  {
    id: 3,
    title: "Interview Ready",
    description: "Land your first interview",
    icon: "🎤",
    unlocked: true,
    unlockedDate: "2024-01-16",
    xpReward: 150
  },
  {
    id: 4,
    title: "Consistency King",
    description: "Apply for 7 days straight",
    icon: "👑",
    unlocked: true,
    unlockedDate: "2024-01-20",
    xpReward: 200
  },
  {
    id: 5,
    title: "Offer Collector",
    description: "Receive your first job offer",
    icon: "💰",
    unlocked: true,
    unlockedDate: "2024-01-25",
    xpReward: 300
  },
  {
    id: 6,
    title: "Application Master",
    description: "Submit 50 job applications",
    icon: "🏆",
    unlocked: false,
    xpReward: 500
  }
];

export const jobStatusColors = {
  applied: "#3B82F6",    // Blue
  oa: "#F59E0B",         // Yellow/Orange
  interview: "#10B981",   // Green
  offer: "#059669",      // Dark Green
  rejected: "#EF4444"    // Red
};

export const jobStatusLabels = {
  applied: "Applied",
  oa: "Online Assessment",
  interview: "Interview",
  offer: "Offer Received",
  rejected: "Rejected"
};