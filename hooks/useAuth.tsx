import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserStats, Challenge, Badge, Difficulty, AssignmentStatus, Notification, NotificationType, UserRole, Student, CommunityEvent, EcoItem, Visit, AnalyticsData } from '../types';
import { MOCK_CHALLENGES, MOCK_BADGES, MOCK_NOTIFICATIONS, MOCK_STUDENTS, MOCK_COMMUNITY_EVENTS, MOCK_ECO_ITEMS } from '../constants';

// A simple "hash" function for demonstration. 
// In a real app, this would be a secure, one-way hash (like bcrypt) performed on the server.
const hashPassword = (password: string): string => {
  try {
    // Using btoa as a stand-in for a hash. It's not secure, but demonstrates the principle of not storing plain text.
    return btoa(`mindsprouts-salt-${password}`);
  } catch (e) {
    console.error("Failed to hash password", e);
    return password; 
  }
};

const SESSION_TOKEN_KEY = 'mindsprouts-session-token';
const VISITS_KEY = 'mindsprouts-visits';
const ACTIVE_USER_MINUTES = 5;

interface AuthContextType {
  user: User | null;
  stats: UserStats;
  challenges: Challenge[];
  students: Student[];
  events: CommunityEvent[];
  unlockedBadges: Badge[];
  unlockedEcoItems: EcoItem[];
  highScores: Record<string, Partial<Record<Difficulty, number>>>;
  learningProgress: Record<string, { completedContent: string[] }>;
  assignmentProgress: Record<number, { status: AssignmentStatus, submission?: any, submissionImageName?: string }>;
  notifications: Notification[];
  redeemedItems: string[];
  dashboardWidgetOrder: string[];
  hasCompletedFirstMission: boolean;
  hasSeenTour: boolean;
  ecoGoal: string | null;
  loginReward: { streak: number, points: number } | null;
  clearLoginReward: () => void;
  setDashboardWidgetOrder: (order: string[]) => void;
  login: (userId: string, password?: string) => 'success' | 'not_found' | 'invalid_password';
  signup: (userId: string, password?: string) => 'success' | 'user_exists';
  logout: () => void;
  forgotPassword: (userId: string) => { success: boolean, token?: string };
  resetPassword: (userId: string, token: string, newPassword: string) => boolean;
  completeChallenge: (challengeId: number) => void;
  addPoints: (points: number) => void;
  gainPoints: (points: number) => void;
  joinEvent: (eventId: number) => void;
  proposeEvent: (project: Omit<CommunityEvent, 'id' | 'proposer' | 'currentMembers' | 'isJoined' | 'participants'>) => void;
  updateHighScore: (gameId: string, difficulty: Difficulty, score: number) => void;
  completeLearnContent: (topicId: string, contentId: string, points: number) => void;
  submitAssignment: (assignmentId: number, submission: any, submissionImageName?: string) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  redeemItem: (itemId: string, cost: number) => boolean;
  equipAvatar: (avatarUrl: string) => void;
  placeEcoItem: (itemId: string, x: number, y: number) => void;
  completeFirstMission: (goal: string) => void;
  setHasSeenTour: (hasSeen: boolean) => void;
  // Analytics functions
  logVisit: () => void;
  getActiveUsersCount: () => number;
  getAnalyticsData: () => AnalyticsData;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserData {
    stats: UserStats;
    hashedPassword?: string;
    resetToken?: string;
    resetTokenExpiry?: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // This acts as a simple user database that persists across logins in the same session
  const [userDataStore, setUserDataStore] = useState<Record<string, UserData>>({
    'alex_green': {
      stats: {
        points: 1100,
        challengesCompleted: 2,
        rank: 2,
        streak: 5,
        lastLoginDate: yesterday.toISOString() // Pretend last login was yesterday
      },
      hashedPassword: hashPassword('password123')
    },
    'teacher_jane': {
        stats: { points: 0, challengesCompleted: 0, rank: 0, streak: 0, lastLoginDate: null },
        hashedPassword: hashPassword('password123')
    }
  });
  const [stats, setStats] = useState<UserStats>({ points: 0, challengesCompleted: 0, rank: 0, streak: 0, lastLoginDate: null });
  const [loginReward, setLoginReward] = useState<{ streak: number, points: number } | null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_COMMUNITY_EVENTS);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [unlockedEcoItems, setUnlockedEcoItems] = useState<EcoItem[]>([]);
  const [highScores, setHighScores] = useState<Record<string, Partial<Record<Difficulty, number>>>>({});
  const [learningProgress, setLearningProgress] = useState<Record<string, { completedContent: string[] }>>({});
  const [assignmentProgress, setAssignmentProgress] = useState<Record<number, { status: AssignmentStatus, submission?: any, submissionImageName?: string }>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [redeemedItems, setRedeemedItems] = useState<string[]>([]);
  const [dashboardWidgetOrder, setDashboardWidgetOrder] = useState<string[]>(['journey', 'milestone', 'community', 'referral', 'ecoworld', 'personalizedTip']);
  
  const [hasCompletedFirstMission, setHasCompletedFirstMission] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [ecoGoal, setEcoGoal] = useState<string | null>(null);

  // --- Analytics State & Functions ---
  const getVisits = (): Visit[] => {
    try {
        const visitsJSON = localStorage.getItem(VISITS_KEY);
        return visitsJSON ? JSON.parse(visitsJSON) : [];
    } catch (e) {
        return [];
    }
  };

  const setVisits = (visits: Visit[]) => {
      // Clean up old visits to prevent localStorage from growing too large
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentVisits = visits.filter(v => v.timestamp > oneDayAgo);
      localStorage.setItem(VISITS_KEY, JSON.stringify(recentVisits));
  };

  const logVisit = () => {
    if (!user) return;
    const now = Date.now();
    const visits = getVisits();
    // To avoid logging too frequently, only log if the last visit was more than a minute ago
    const lastVisit = visits.filter(v => v.userId === user.userId).pop();
    if (!lastVisit || now - lastVisit.timestamp > 60 * 1000) {
        setVisits([...visits, { userId: user.userId, timestamp: now }]);
    }
  };

  const getActiveUsersCount = (): number => {
    const visits = getVisits();
    const fiveMinutesAgo = Date.now() - ACTIVE_USER_MINUTES * 60 * 1000;
    const activeVisits = visits.filter(v => v.timestamp > fiveMinutesAgo);
    const uniqueActiveUsers = new Set(activeVisits.map(v => v.userId));
    return uniqueActiveUsers.size;
  };
  
  const getAnalyticsData = (): AnalyticsData => {
    const visits = getVisits();
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayVisits = visits.filter(v => v.timestamp >= todayStart);

    // Total Unique Visitors
    const totalUniqueVisitors = new Set(todayVisits.map(v => v.userId)).size;

    // Peak Concurrent & Chart Data
    let peakConcurrent = 0;
    const chartData: { time: string; users: number }[] = [];
    const interval = 5 * 60 * 1000; // 5 minutes

    for (let i = 0; i < 6; i++) {
        const windowEnd = now - (i * interval);
        const windowStart = windowEnd - interval;
        
        const windowVisits = todayVisits.filter(v => v.timestamp >= windowStart && v.timestamp < windowEnd);
        const activeInWindow = new Set(windowVisits.map(v => v.userId)).size;

        if (activeInWindow > peakConcurrent) {
            peakConcurrent = activeInWindow;
        }

        chartData.unshift({
            time: new Date(windowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            users: activeInWindow
        });
    }

    return {
        activeUsers: getActiveUsersCount(),
        peakConcurrent,
        totalUniqueVisitors,
        chartData
    };
  };

  // Effect to restore session from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
        try {
            // In a real app, you would verify this token with the server.
            const { userId, expiry } = JSON.parse(atob(token));
            if (userId && userDataStore[userId] && expiry > Date.now()) {
                const userData = userDataStore[userId];
                let userObject: User;
                if (userId === 'teacher_jane') {
                    userObject = { userId, school: 'Oakwood Academy', avatar: 'https://i.pravatar.cc/100?u=teacher', role: UserRole.TEACHER };
                } else {
                    userObject = { userId, school: 'Oakwood Academy', avatar: `https://i.pravatar.cc/100?u=${userId}`, role: UserRole.STUDENT };
                }
                setUser(userObject);
                setStats(userData.stats);
            } else {
                logout(); // Token is invalid or expired
            }
        } catch (error) {
            console.error("Failed to parse session token:", error);
            logout();
        }
    }
  }, []); // Run only on mount.

  useEffect(() => {
    if (user && user.role === UserRole.STUDENT) {
        const nextChallenge = challenges.find(c => !c.completed);
        const dynamicNotifications = [...MOCK_NOTIFICATIONS];

        if (nextChallenge) {
            const hasChallengeNotification = dynamicNotifications.some(n => n.type === NotificationType.CHALLENGE && n.relatedId === nextChallenge.id);
            if (!hasChallengeNotification) {
                 dynamicNotifications.unshift({
                    id: Date.now(),
                    type: NotificationType.CHALLENGE,
                    titleKey: 'notification_new_challenge_title',
                    messageKey: 'notification_new_challenge_message',
                    timestamp: new Date().toISOString(),
                    read: false,
                    relatedId: nextChallenge.id,
                });
            }
        }
        setNotifications(dynamicNotifications);
    } else {
        setNotifications([]);
    }
  }, [user, challenges]);

  useEffect(() => {
    const completedCount = stats.challengesCompleted;
    const newBadges = MOCK_BADGES.filter(badge => completedCount >= badge.milestone);
    setUnlockedBadges(newBadges);
  }, [stats.challengesCompleted]);
  
  const clearLoginReward = () => setLoginReward(null);

  const setAndStoreStats = (userId: string, newStats: UserStats) => {
    setStats(newStats);
    setUserDataStore(prev => ({
        ...prev,
        [userId]: { ...prev[userId], stats: newStats }
    }));
  };

  const performLogin = (userId: string, userData: UserData) => {
     // 1. Create and store session token (simulated JWT)
    const tokenPayload = { userId, expiry: Date.now() + 8 * 60 * 60 * 1000 }; // 8 hour session
    const token = btoa(JSON.stringify(tokenPayload));
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    
    // 2. Handle login rewards and streak
    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isYesterday = (d1: Date, d2: Date) => {
        const yesterday = new Date(d1);
        yesterday.setDate(d1.getDate() - 1);
        return isSameDay(yesterday, d2);
    };
    
    const today = new Date();
    let rewardPoints = 0;
    
    const lastLogin = userData.stats.lastLoginDate ? new Date(userData.stats.lastLoginDate) : null;
    let newStreak = userData.stats.streak;

    if (!lastLogin || !isSameDay(today, lastLogin)) {
        if (lastLogin && isYesterday(today, lastLogin)) {
            newStreak += 1;
            rewardPoints = 10 + newStreak; // Streak bonus
            setLoginReward({ streak: newStreak, points: rewardPoints });
        } else if(lastLogin) { // Not yesterday, streak is broken
            newStreak = 1;
            rewardPoints = 10;
            setLoginReward({ streak: newStreak, points: rewardPoints });
        } else { // No last login date
             newStreak = 1;
             rewardPoints = 10;
             setLoginReward({ streak: newStreak, points: rewardPoints });
        }
    }
    const newStats: UserStats = {
        ...userData.stats,
        points: userData.stats.points + rewardPoints,
        streak: newStreak,
        lastLoginDate: today.toISOString(),
    };
    
    setAndStoreStats(userId, newStats);

    // 3. Set the user object for the context
    if (userId === 'teacher_jane') {
        setUser({ userId, school: 'Oakwood Academy', avatar: 'https://i.pravatar.cc/100?u=teacher', role: UserRole.TEACHER });
    } else {
        setUser({ userId, school: 'Oakwood Academy', avatar: `https://i.pravatar.cc/100?u=${userId}`, role: UserRole.STUDENT });
    }

    // 4. Reset other non-persistent states for demo freshness
    setChallenges(MOCK_CHALLENGES.map(c => ({...c, completed: false})));
    setAssignmentProgress({});
    setLearningProgress({});
    setRedeemedItems([]);
    setUnlockedEcoItems([]);
    setHasCompletedFirstMission(false);
    setHasSeenTour(false);
    setEcoGoal(null);
  }

  const login = (userId: string, password?: string): 'success' | 'not_found' | 'invalid_password' => {
    const userData = userDataStore[userId];
    if (!userData) return 'not_found';
    if (!password || userData.hashedPassword !== hashPassword(password)) {
      return 'invalid_password';
    }
    performLogin(userId, userData);
    return 'success';
  };
  
  const signup = (userId: string, password?: string): 'success' | 'user_exists' => {
    const existingUserData = userDataStore[userId];
    if (existingUserData) return 'user_exists';

    if (password) {
        // 1. Create new user data
        const hashedPassword = hashPassword(password);
        const newUserStats: UserStats = {
            points: 0,
            challengesCompleted: 0,
            rank: Object.keys(userDataStore).length + 1,
            streak: 0, // Will be set to 1 on first login
            lastLoginDate: null,
        };
        const newUserData: UserData = { stats: newUserStats, hashedPassword };
        
        // 2. Update the user data store state
        setUserDataStore(prev => ({
            ...prev,
            [userId]: newUserData
        }));
        
        // 3. Immediately log the new user in, passing the new data directly to avoid state update delays.
        performLogin(userId, newUserData);
        return 'success';
    }

    return 'user_exists'; // Should not happen if password is required
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setLoginReward(null);
  };
  
  const forgotPassword = (userId: string): { success: boolean, token?: string } => {
    const userData = userDataStore[userId];
    if (!userData) {
      // Still return success to prevent user enumeration attacks
      return { success: true };
    }
    // In a real app, this token would be generated securely and be much longer.
    const token = `reset-${Date.now()}`; 
    const expiry = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
    
    setUserDataStore(prev => ({
      ...prev,
      [userId]: { ...prev[userId], resetToken: token, resetTokenExpiry: expiry }
    }));
    
    // In a real app, you would now email this token to the user.
    // For simulation, we return it directly.
    return { success: true, token };
  };

  const resetPassword = (userId: string, token: string, newPassword: string): boolean => {
    const userData = userDataStore[userId];
    if (!userData || userData.resetToken !== token || (userData.resetTokenExpiry && userData.resetTokenExpiry < Date.now())) {
      return false; // Invalid user, token, or token expired
    }
    
    const newHashedPassword = hashPassword(newPassword);
    setUserDataStore(prev => ({
      ...prev,
      [userId]: { ...prev[userId], hashedPassword: newHashedPassword, resetToken: undefined, resetTokenExpiry: undefined }
    }));
    
    return true;
  };


  const addPoints = (points: number) => {
    if (!user) return;
    const newStats = { ...stats, points: stats.points + points };
    setAndStoreStats(user.userId, newStats);
  };

  const gainPoints = (points: number) => {
    if (!user) return;
    const newStats = { ...stats, points: stats.points + points };
    setAndStoreStats(user.userId, newStats);
  };

  const completeFirstMission = (goal: string) => {
    setEcoGoal(goal);
    addPoints(25);
    setHasCompletedFirstMission(true);
  };

  const completeChallenge = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed && user) {
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, completed: true } : c));
      
      const newStats = {
        ...stats,
        points: stats.points + challenge.points,
        challengesCompleted: stats.challengesCompleted + 1,
      };
      setAndStoreStats(user.userId, newStats);
      
      const unlockedItem = MOCK_ECO_ITEMS.find(item => item.challengeId === challengeId);
      if (unlockedItem && !unlockedEcoItems.some(i => i.id === unlockedItem.id)) {
          setUnlockedEcoItems(prev => [...prev, { ...unlockedItem, isPlaced: false, x: null, y: null }]);
      }
    }
  };

  const redeemItem = (itemId: string, cost: number): boolean => {
    if (stats.points >= cost && user) {
        const newStats = { ...stats, points: stats.points - cost };
        setAndStoreStats(user.userId, newStats);
        setRedeemedItems(prev => [...prev, itemId]);
        return true;
    }
    return false;
  };
  
  const equipAvatar = (avatarUrl: string) => {
    setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
  };

  const placeEcoItem = (itemId: string, x: number, y: number) => {
    setUnlockedEcoItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isPlaced: true, x, y } : item
    ));
  };

  const joinEvent = (eventId: number) => {
    if (!user) return;
    setEvents(prevEvents => 
        prevEvents.map(e => {
            if (e.id === eventId && !e.isJoined && e.currentMembers < e.maxMembers) {
                return { 
                    ...e, 
                    isJoined: true, 
                    currentMembers: e.currentMembers + 1,
                    participants: [...e.participants, user.userId]
                };
            }
            return e;
        })
    );
  };

  const proposeEvent = (eventData: Omit<CommunityEvent, 'id' | 'proposer' | 'currentMembers' | 'isJoined' | 'participants'>) => {
    alert(`Event "${eventData.titleKey}" submitted for review!`);
  };

  const updateHighScore = (gameId: string, difficulty: Difficulty, score: number) => {
    setHighScores(prev => {
        const currentGameScores = prev[gameId] || {};
        const currentHighScore = currentGameScores[difficulty] || 0;
        if (score > currentHighScore) {
            return {
                ...prev,
                [gameId]: {
                    ...currentGameScores,
                    [difficulty]: score,
                },
            };
        }
        return prev;
    });
  };

  const completeLearnContent = (topicId: string, contentId: string, points: number) => {
    setLearningProgress(prev => {
        const currentTopicProgress = prev[topicId] || { completedContent: [] };
        if (currentTopicProgress.completedContent.includes(contentId)) {
            return prev;
        }
        addPoints(points);
        return {
            ...prev,
            [topicId]: {
                ...currentTopicProgress,
                completedContent: [...currentTopicProgress.completedContent, contentId],
            },
        };
    });
  };

  const submitAssignment = (assignmentId: number, submission: any, submissionImageName?: string) => {
      setAssignmentProgress(prev => ({
          ...prev,
          [assignmentId]: { status: AssignmentStatus.SUBMITTED, submission, submissionImageName },
      }));

      setTimeout(() => {
          setAssignmentProgress(prev => {
              if (prev[assignmentId]?.status === AssignmentStatus.SUBMITTED) {
                  const assignment = MOCK_CHALLENGES.find(a => a.id === assignmentId);
                  if(assignment) addPoints(assignment.points);
                  
                  return {
                      ...prev,
                      [assignmentId]: { ...prev[assignmentId], status: AssignmentStatus.APPROVED },
                  }
              }
              return prev;
          });
      }, 2000);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const contextValue = { user, stats, challenges, students, events, joinEvent, proposeEvent, unlockedBadges, unlockedEcoItems, placeEcoItem, highScores, learningProgress, assignmentProgress, notifications, redeemedItems, redeemItem, equipAvatar, login, signup, logout, forgotPassword, resetPassword, completeChallenge, addPoints, gainPoints, updateHighScore, completeLearnContent, submitAssignment, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications, dashboardWidgetOrder, setDashboardWidgetOrder, hasCompletedFirstMission, hasSeenTour, ecoGoal, completeFirstMission, setHasSeenTour, loginReward, clearLoginReward, logVisit, getActiveUsersCount, getAnalyticsData };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};