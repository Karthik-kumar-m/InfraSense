import * as kv from './kv_store.tsx';

export interface UserGamification {
  userId: string;
  points: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  streak: number;
  lastActivityDate: string;
  totalIssuesReported: number;
  totalIssuesResolved: number;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
}

const PREDEFINED_BADGES = [
  { id: 'first-report', name: 'First Reporter', description: 'Submit your first issue', icon: 'star' },
  { id: 'quick-responder', name: 'Quick Responder', description: 'Report 5 issues', icon: 'zap' },
  { id: 'campus-hero', name: 'Campus Hero', description: 'Report 10 issues', icon: 'shield' },
  { id: 'detail-master', name: 'Detail Master', description: 'Submit detailed reports', icon: 'file-text' },
  { id: 'trend-setter', name: 'Trend Setter', description: 'Report popular issues', icon: 'trending-up' },
  { id: 'week-warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame' },
  { id: 'top-contributor', name: 'Top Contributor', description: 'Reach top 10 on leaderboard', icon: 'trophy' },
  { id: 'early-bird', name: 'Early Bird', description: 'First to report critical issues', icon: 'sunrise' },
];

export async function getUserGamification(userId: string): Promise<UserGamification> {
  const gamification = await kv.get(`gamification:${userId}`);
  
  if (gamification) {
    return gamification as UserGamification;
  }
  
  // Initialize new gamification profile
  const newGamification: UserGamification = {
    userId,
    points: 0,
    level: 1,
    badges: [],
    achievements: [
      { id: 'ach-1', name: 'Getting Started', description: 'Report your first issue', progress: 0, target: 1, completed: false },
      { id: 'ach-2', name: 'Regular Reporter', description: 'Report 5 issues', progress: 0, target: 5, completed: false },
      { id: 'ach-3', name: 'Campus Guardian', description: 'Report 10 issues', progress: 0, target: 10, completed: false },
      { id: 'ach-4', name: 'Issue Hunter', description: 'Report 25 issues', progress: 0, target: 25, completed: false },
    ],
    streak: 0,
    lastActivityDate: new Date().toISOString(),
    totalIssuesReported: 0,
    totalIssuesResolved: 0,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, newGamification);
  return newGamification;
}

export async function addPoints(userId: string, points: number, reason: string): Promise<UserGamification> {
  const gamification = await getUserGamification(userId);
  
  const newPoints = gamification.points + points;
  const newLevel = Math.floor(newPoints / 100) + 1;
  
  const updatedGamification: UserGamification = {
    ...gamification,
    points: newPoints,
    level: newLevel,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, updatedGamification);
  
  // Log the points activity
  await kv.set(`points-log:${userId}:${Date.now()}`, {
    userId,
    points,
    reason,
    timestamp: new Date().toISOString(),
  });
  
  return updatedGamification;
}

export async function updateStreak(userId: string): Promise<UserGamification> {
  const gamification = await getUserGamification(userId);
  const today = new Date().toDateString();
  const lastActivity = new Date(gamification.lastActivityDate).toDateString();
  
  let newStreak = gamification.streak;
  
  if (today !== lastActivity) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity === yesterday.toDateString()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }
  
  const updatedGamification: UserGamification = {
    ...gamification,
    streak: newStreak,
    lastActivityDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, updatedGamification);
  
  // Check for streak badges
  if (newStreak >= 7 && !gamification.badges.find(b => b.id === 'week-warrior')) {
    await awardBadge(userId, 'week-warrior');
  }
  
  return updatedGamification;
}

export async function awardBadge(userId: string, badgeId: string): Promise<UserGamification> {
  const gamification = await getUserGamification(userId);
  const badgeTemplate = PREDEFINED_BADGES.find(b => b.id === badgeId);
  
  if (!badgeTemplate) {
    return gamification;
  }
  
  // Check if badge already awarded
  if (gamification.badges.find(b => b.id === badgeId)) {
    return gamification;
  }
  
  const newBadge: Badge = {
    ...badgeTemplate,
    earnedAt: new Date().toISOString(),
  };
  
  const updatedGamification: UserGamification = {
    ...gamification,
    badges: [...gamification.badges, newBadge],
    points: gamification.points + 50, // Badge bonus
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, updatedGamification);
  return updatedGamification;
}

export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
): Promise<UserGamification> {
  const gamification = await getUserGamification(userId);
  
  const updatedAchievements = gamification.achievements.map(ach => {
    if (ach.id === achievementId) {
      const newProgress = Math.min(progress, ach.target);
      const completed = newProgress >= ach.target;
      
      return {
        ...ach,
        progress: newProgress,
        completed,
        completedAt: completed && !ach.completed ? new Date().toISOString() : ach.completedAt,
      };
    }
    return ach;
  });
  
  const updatedGamification: UserGamification = {
    ...gamification,
    achievements: updatedAchievements,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, updatedGamification);
  return updatedGamification;
}

export async function incrementIssueCount(userId: string): Promise<UserGamification> {
  const gamification = await getUserGamification(userId);
  
  const newCount = gamification.totalIssuesReported + 1;
  
  let updatedGamification: UserGamification = {
    ...gamification,
    totalIssuesReported: newCount,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`gamification:${userId}`, updatedGamification);
  
  // Award badges based on count
  if (newCount === 1) {
    updatedGamification = await awardBadge(userId, 'first-report');
  } else if (newCount === 5) {
    updatedGamification = await awardBadge(userId, 'quick-responder');
  } else if (newCount === 10) {
    updatedGamification = await awardBadge(userId, 'campus-hero');
  }
  
  // Update achievements
  await updateAchievementProgress(userId, 'ach-1', newCount);
  await updateAchievementProgress(userId, 'ach-2', newCount);
  await updateAchievementProgress(userId, 'ach-3', newCount);
  await updateAchievementProgress(userId, 'ach-4', newCount);
  
  return await getUserGamification(userId);
}

export async function getLeaderboard(limit: number = 10): Promise<Array<{ userId: string; points: number; level: number; name?: string }>> {
  const allGamification = await kv.getByPrefix('gamification:');
  
  const leaderboard = allGamification
    .map(item => item.value as UserGamification)
    .filter(g => g && g.userId)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map(g => ({
      userId: g.userId,
      points: g.points,
      level: g.level,
    }));
  
  return leaderboard;
}
