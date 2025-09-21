export enum Page {
    HOME = 'Home',
    TASKS_AND_CHALLENGES = 'Tasks & Challenges',
    LEADERBOARD = 'Leaderboard',
    RESOURCES = 'Resources',
    AI_ASSISTANT = 'AI Assistant',
    PROFILE = 'Profile',
    ABOUT = 'About',
    GAMES = 'Games',
    ECO_LIBRARY = 'Eco Library',
    WEEKLY_ASSIGNMENTS = 'Weekly Assignments',
    LEARNING_VIDEOS = 'Learning Videos',
    STUDENT_ROSTER = 'Student Roster',
    EVENTS = 'Events',
    ECO_DONTS = 'Eco Don\'ts',
    INTERACTIVE_QUIZZES = 'Interactive Quizzes',
    REDEMPTION_CENTER = 'Redemption Center',
    ANALYTICS = 'Analytics',
}

export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher'
}

export enum AuthView {
    LOGIN = 'login',
    SIGNUP = 'signup',
    FORGOT_PASSWORD = 'forgot_password',
    RESET_PASSWORD = 'reset_password',
}

export enum ChallengeCategory {
    RECYCLING = 'recycling',
    ENERGY = 'energy',
    WATER = 'water',
    COMMUNITY = 'community',
    WASTE_REDUCTION = 'waste_reduction',
}

export interface Challenge {
    id: number;
    titleKey: string;
    descriptionKey: string;
    category: ChallengeCategory;
    points: number;
    completed: boolean;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    avatar: string;
    points: number;
    school: string;
}

export enum ResourceType {
    ARTICLE = 'article',
    VIDEO = 'video',
    GUIDE = 'guide',
}

export interface Resource {
    id: number;
    titleKey: string;
    summaryKey: string;
    type: ResourceType;
    imageUrl: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface User {
    userId: string;
    school: string;
    avatar: string;
    role: UserRole;
}

export interface UserStats {
    points: number;
    challengesCompleted: number;
    rank: number;
    streak: number;
    lastLoginDate: string | null;
}

export interface Student {
    id: string;
    name: string;
    avatar: string;
    school: string;
    points: number;
    challengesCompleted: number;
}

export interface Badge {
    id: number;
    nameKey: string;
    descriptionKey: string;
    emoji: string;
    milestone: number; // e.g., number of challenges to complete
}

export enum Difficulty {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export enum QuizTopic {
    RECYCLING = 'recycling',
    WATER = 'water',
    ENERGY = 'energy',
}

export interface QuizQuestion {
    questionKey: string;
    optionKeys: string[];
    correctOptionIndex: number;
}
  
export interface Quiz {
    titleKey: string;
    emoji: string;
    questions: QuizQuestion[];
}

export interface LearnContent {
    id: string;
    type: 'video' | 'infographic' | 'quiz' | 'article' | 'ebook' | 'case_study';
    titleKey: string;
    points: number;
    url?: string;
    imageUrl?: string;
    contentKey?: string;
    questions?: QuizQuestion[];
}
  
export interface LearnLevel {
    level: number;
    titleKey: string;
    badgeEmoji: string;
    content: LearnContent[];
}

export interface LearnTopic {
    id: string;
    titleKey: string;
    descriptionKey: string;
    icon: 'ClimateChange' | 'CircularEconomy' | 'SustainableAgriculture' | 'WaterConservation' | 'Biodiversity' | 'RenewableEnergy';
    levels: LearnLevel[];
}

export enum AssignmentStatus {
    NOT_STARTED = 'Not Started',
    SUBMITTED = 'Submitted',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export enum SubmissionType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video'
}
export interface Assignment {
    id: number;
    titleKey: string;
    descriptionKey: string;
    points: number;
    submissionType: SubmissionType;
}
  
export interface AssignmentWeek {
    weekNumber: number;
    titleKey: string;
    themeEmoji: string;
    assignments: Assignment[];
}

export enum NotificationType {
    CHALLENGE = 'challenge',
    ASSIGNMENT = 'assignment',
    LEADERBOARD = 'leaderboard',
    TIP = 'tip',
    EVENT = 'event',
}

export interface Notification {
    id: number;
    type: NotificationType;
    titleKey: string;
    messageKey: string;
    timestamp: string; // ISO string
    read: boolean;
    relatedId?: number; // e.g., challengeId or assignmentId
}

// Learning Videos Feature Types
export interface VideoQuizQuestion {
    questionKey: string;
    options: string[];
    correctOptionIndex: number;
    hintKey: string;
}

export interface LearningVideo {
    id: string;
    titleKey: string;
    descriptionKey: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    points: number;
    quiz: VideoQuizQuestion[];
}

// Community Hub Feature Types
export enum EventCategory {
    AIR_QUALITY = 'Air Quality & Pollution',
    OCEANS = 'Oceans & Water Bodies',
    RENEWABLE_ENERGY = 'Renewable Energy & Innovation',
    SUSTAINABLE_AGRICULTURE = 'Sustainable Agriculture & Food',
    ECO_TECH = 'Eco-Technology & Innovation',
    CLIMATE_ACTION = 'Climate Action & Policy Awareness',
    FOREST_WILDLIFE = 'Forest & Wildlife Protection',
    ECO_TRANSPORT = 'Eco-Friendly Transportation',
    GREEN_BUILDING = 'Green Building & Infrastructure',
    AWARENESS_CAMPAIGNS = 'Awareness Campaigns & Community Projects',
}
  
export interface CommunityEvent {
    id: number;
    titleKey: string;
    descriptionKey: string;
    category: EventCategory;
    points: number;
    maxMembers: number;
    currentMembers: number;
    proposer: {
      name: string;
      avatar: string;
    };
    isJoined: boolean;
    date: string; 
    time: string;
    venue: string;
    participants: string[];
}

// Redemption Center Types
export enum RewardCategory {
    VIRTUAL = 'Virtual Goods',
    DISCOUNT = 'Partner Discounts',
    DONATION = 'Charity Donations',
    AVATAR = 'Avatar',
}

export interface RedemptionItem {
    id: string;
    category: RewardCategory;
    titleKey: string;
    descriptionKey: string;
    cost: number;
    icon: 'Badge' | 'Coupon' | 'Donation' | 'Gift';
    imageUrl?: string;
}

// EcoWorld Types
export interface EcoItem {
  id: string;
  nameKey: string;
  emoji: string;
  challengeId: number; // The challenge that unlocks this item
  isPlaced: boolean;
  x: number | null; // Position on the grid
  y: number | null;
}

// Community Highlight for Dashboard
export interface CommunityHighlight {
    type: 'badge' | 'challenge';
    userName: string;
    userAvatar: string;
    contentKey: string; // A translation key
    badgeNameKey?: any; // e.g. badge_planet_protector
    challengeTitleKey?: string; // e.g. 'challenge4_title'
    imageUrl?: string; // for challenge photos
}

// Onboarding Types
export interface OnboardingQuizQuestion {
    questionKey: string;
    options: {
      textKey: string;
      topic: 'Recycling' | 'Water' | 'Energy' | 'General';
    }[];
}

// Analytics Types
export interface Visit {
    userId: string;
    timestamp: number; // Unix timestamp
}

export interface AnalyticsData {
    activeUsers: number;
    peakConcurrent: number;
    totalUniqueVisitors: number;
    chartData: { time: string; users: number }[];
}