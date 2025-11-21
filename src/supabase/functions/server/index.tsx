import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { getSupabaseAdmin, getSupabaseClient } from "./supabase.tsx";
import { createUserProfile, getUserProfile, updateUserProfile } from "./db-users.tsx";
import { 
  createIssue, 
  getIssue, 
  updateIssue, 
  getUserIssues, 
  getAllIssues,
  getIssuesByStatus,
  getIssuesByDepartment,
  upvoteIssue 
} from "./db-issues.tsx";
import {
  getUserGamification,
  addPoints,
  updateStreak,
  incrementIssueCount,
  getLeaderboard
} from "./db-gamification.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f232df90/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/make-server-f232df90/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'student', studentId, department } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields: email, password, name' }, 400);
    }
    
    const supabase = getSupabaseAdmin();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });
    
    if (authError || !authData.user) {
      console.log(`Authentication error during user signup: ${authError?.message}`);
      return c.json({ error: `Failed to create user: ${authError?.message}` }, 400);
    }
    
    // Create user profile
    const userProfile = await createUserProfile({
      id: authData.user.id,
      email,
      name,
      role: role as 'student' | 'staff' | 'admin',
      department,
      studentId,
    });
    
    return c.json({ 
      user: authData.user,
      profile: userProfile,
      message: 'User created successfully'
    });
    
  } catch (error) {
    console.log(`Error during signup process: ${error}`);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// Sign in
app.post("/make-server-f232df90/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Use the client (anon key) for sign in, not admin
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error || !data.session) {
      console.log(`Authentication error during sign in: ${error?.message}`);
      return c.json({ error: `Sign in failed: ${error?.message || 'Invalid credentials'}` }, 401);
    }
    
    // Get user profile
    const profile = await getUserProfile(data.user.id);
    
    return c.json({
      session: data.session,
      user: data.user,
      profile,
      accessToken: data.session.access_token,
    });
    
  } catch (error) {
    console.log(`Error during sign in process: ${error}`);
    return c.json({ error: `Sign in failed: ${error.message}` }, 500);
  }
});

// Get current session
app.get("/make-server-f232df90/auth/session", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Session validation error: ${error?.message}`);
      return c.json({ error: 'Invalid session' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    
    return c.json({
      user,
      profile,
    });
    
  } catch (error) {
    console.log(`Error validating session: ${error}`);
    return c.json({ error: `Session validation failed: ${error.message}` }, 500);
  }
});

// Sign out
app.post("/make-server-f232df90/auth/signout", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.admin.signOut(accessToken);
    
    if (error) {
      console.log(`Error during sign out: ${error.message}`);
      return c.json({ error: `Sign out failed: ${error.message}` }, 400);
    }
    
    return c.json({ message: 'Signed out successfully' });
    
  } catch (error) {
    console.log(`Error during sign out process: ${error}`);
    return c.json({ error: `Sign out failed: ${error.message}` }, 500);
  }
});

// ==================== ISSUE ROUTES ====================

// Create a new issue (requires auth)
app.post("/make-server-f232df90/issues", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const issueData = await c.req.json();
    
    // Get user profile for additional info
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    // Create the issue
    const issue = await createIssue({
      userId: user.id,
      studentName: profile.name,
      studentEmail: profile.email,
      title: issueData.title,
      description: issueData.description,
      category: issueData.category,
      location: issueData.location,
      room: issueData.room,
      building: issueData.building,
      floor: issueData.floor,
      status: 'open',
      priority: issueData.priority || 'medium',
      sentiment: issueData.sentiment || 'medium',
      imageUrl: issueData.imageUrl,
      upvotes: 0,
      tags: issueData.tags || [],
    });
    
    // Update gamification
    await incrementIssueCount(user.id);
    await addPoints(user.id, 10, 'Issue reported');
    await updateStreak(user.id);
    
    return c.json({ issue, message: 'Issue created successfully' }, 201);
    
  } catch (error) {
    console.log(`Error creating issue: ${error}`);
    return c.json({ error: `Failed to create issue: ${error.message}` }, 500);
  }
});

// Get all issues (staff/admin only for all, students get their own)
app.get("/make-server-f232df90/issues", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    console.log('[GET /issues] Request received, token:', accessToken ? 'present' : 'missing');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log('[GET /issues] Auth error:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    console.log('[GET /issues] Authenticated user:', user.id);
    
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      console.log('[GET /issues] User profile not found for:', user.id);
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    console.log('[GET /issues] User profile:', profile.role, profile.email);
    
    let issues;
    
    // Staff and admin can see all issues
    if (profile.role === 'staff' || profile.role === 'admin') {
      const status = c.req.query('status');
      const department = c.req.query('department');
      
      if (status) {
        issues = await getIssuesByStatus(status);
      } else if (department) {
        issues = await getIssuesByDepartment(department);
      } else {
        issues = await getAllIssues();
      }
      console.log('[GET /issues] Staff/Admin - returning', issues.length, 'issues');
    } else {
      // Students only see their own issues
      issues = await getUserIssues(user.id);
      console.log('[GET /issues] Student - returning', issues.length, 'issues for user:', user.id);
    }
    
    return c.json({ issues });
    
  } catch (error) {
    console.log(`[GET /issues] Error fetching issues: ${error}`);
    return c.json({ error: `Failed to fetch issues: ${error.message}` }, 500);
  }
});

// Get a single issue by ID
app.get("/make-server-f232df90/issues/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const issueId = c.req.param('id');
    const issue = await getIssue(issueId);
    
    if (!issue) {
      return c.json({ error: 'Issue not found' }, 404);
    }
    
    const profile = await getUserProfile(user.id);
    
    // Students can only view their own issues
    if (profile?.role === 'student' && issue.userId !== user.id) {
      return c.json({ error: 'Unauthorized to view this issue' }, 403);
    }
    
    return c.json({ issue });
    
  } catch (error) {
    console.log(`Error fetching issue: ${error}`);
    return c.json({ error: `Failed to fetch issue: ${error.message}` }, 500);
  }
});

// Update an issue (staff/admin only)
app.put("/make-server-f232df90/issues/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    
    // Only staff and admin can update issues
    if (profile?.role !== 'staff' && profile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Only staff can update issues' }, 403);
    }
    
    const issueId = c.req.param('id');
    const updates = await c.req.json();
    
    const updatedIssue = await updateIssue(issueId, updates);
    
    if (!updatedIssue) {
      return c.json({ error: 'Issue not found' }, 404);
    }
    
    return c.json({ issue: updatedIssue, message: 'Issue updated successfully' });
    
  } catch (error) {
    console.log(`Error updating issue: ${error}`);
    return c.json({ error: `Failed to update issue: ${error.message}` }, 500);
  }
});

// Upvote an issue
app.post("/make-server-f232df90/issues/:id/upvote", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const issueId = c.req.param('id');
    const issue = await upvoteIssue(issueId);
    
    if (!issue) {
      return c.json({ error: 'Issue not found' }, 404);
    }
    
    return c.json({ issue, message: 'Issue upvoted successfully' });
    
  } catch (error) {
    console.log(`Error upvoting issue: ${error}`);
    return c.json({ error: `Failed to upvote issue: ${error.message}` }, 500);
  }
});

// ==================== GAMIFICATION ROUTES ====================

// Get user gamification data
app.get("/make-server-f232df90/gamification", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    console.log('[GET /gamification] Request received, token:', accessToken ? 'present' : 'missing');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log('[GET /gamification] Auth error:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    console.log('[GET /gamification] Authenticated user:', user.id);
    
    const gamification = await getUserGamification(user.id);
    console.log('[GET /gamification] Gamification data:', gamification);
    
    return c.json({ gamification });
    
  } catch (error) {
    console.log(`[GET /gamification] Error fetching gamification data: ${error}`);
    return c.json({ error: `Failed to fetch gamification data: ${error.message}` }, 500);
  }
});

// Get leaderboard
app.get("/make-server-f232df90/gamification/leaderboard", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const limit = parseInt(c.req.query('limit') || '10');
    const leaderboard = await getLeaderboard(limit);
    
    // Get user profiles for leaderboard entries
    const enrichedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const profile = await getUserProfile(entry.userId);
        return {
          ...entry,
          name: profile?.name || 'Unknown User',
        };
      })
    );
    
    return c.json({ leaderboard: enrichedLeaderboard });
    
  } catch (error) {
    console.log(`Error fetching leaderboard: ${error}`);
    return c.json({ error: `Failed to fetch leaderboard: ${error.message}` }, 500);
  }
});

// ==================== ADMIN/STAFF ROUTES ====================

// Get analytics/dashboard stats (staff/admin only)
app.get("/make-server-f232df90/admin/analytics", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    
    if (profile?.role !== 'staff' && profile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Staff/Admin access required' }, 403);
    }
    
    const allIssues = await getAllIssues();
    
    // Calculate statistics
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Current stats
    const currentOpen = allIssues.filter(i => i.status === 'open').length;
    const currentInProgress = allIssues.filter(i => i.status === 'in-progress').length;
    const currentResolved = allIssues.filter(i => i.status === 'resolved').length;
    
    // Issues created in last 24 hours
    const issuesLast24h = allIssues.filter(i => new Date(i.createdAt) >= yesterday).length;
    
    // Issues created 24-48 hours ago
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const issuesPrevious24h = allIssues.filter(i => {
      const created = new Date(i.createdAt);
      return created >= twoDaysAgo && created < yesterday;
    }).length;
    
    // Issues in progress: compare current vs 24h ago (approximate by looking at status changes)
    const inProgressLast24h = allIssues.filter(i => 
      i.status === 'in-progress' && new Date(i.updatedAt || i.createdAt) >= yesterday
    ).length;
    
    // Resolved issues: this week vs last week
    const resolvedThisWeek = allIssues.filter(i => 
      i.status === 'resolved' && new Date(i.updatedAt || i.createdAt) >= lastWeek
    ).length;
    const resolvedLastWeek = allIssues.filter(i => {
      const updated = new Date(i.updatedAt || i.createdAt);
      return i.status === 'resolved' && updated >= twoWeeksAgo && updated < lastWeek;
    }).length;
    
    // Calculate average resolution time for resolved issues
    const resolvedIssues = allIssues.filter(i => i.status === 'resolved');
    let avgResolutionHours = 0;
    if (resolvedIssues.length > 0) {
      const totalHours = resolvedIssues.reduce((sum, issue) => {
        const created = new Date(issue.createdAt).getTime();
        const resolved = new Date(issue.updatedAt || issue.createdAt).getTime();
        const hours = (resolved - created) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      avgResolutionHours = totalHours / resolvedIssues.length;
    }
    
    // Calculate trends
    const pendingTrend = issuesPrevious24h > 0 
      ? ((issuesLast24h - issuesPrevious24h) / issuesPrevious24h * 100).toFixed(1)
      : issuesLast24h > 0 ? '100' : '0';
    
    const inProgressTrend = currentInProgress > 0 && inProgressLast24h > 0
      ? ((inProgressLast24h / currentInProgress * 100) - 100).toFixed(1)
      : '0';
    
    const resolvedTrend = resolvedLastWeek > 0
      ? ((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek * 100).toFixed(1)
      : resolvedThisWeek > 0 ? '100' : '0';
    
    const stats = {
      totalIssues: allIssues.length,
      openIssues: currentOpen,
      assignedIssues: allIssues.filter(i => i.status === 'assigned').length,
      inProgressIssues: currentInProgress,
      resolvedIssues: currentResolved,
      closedIssues: allIssues.filter(i => i.status === 'closed').length,
      highPriorityIssues: allIssues.filter(i => i.priority === 'high' || i.priority === 'critical').length,
      criticalIssues: allIssues.filter(i => i.priority === 'critical').length,
      avgResolutionTime: avgResolutionHours.toFixed(1),
      categoryBreakdown: {} as Record<string, number>,
      priorityBreakdown: {} as Record<string, number>,
      statusBreakdown: {} as Record<string, number>,
      recentIssues: allIssues.slice(0, 10),
      trends: {
        pending: {
          value: pendingTrend,
          isPositive: parseFloat(pendingTrend) < 0, // Lower pending is better
          comparison: `${issuesLast24h} today vs ${issuesPrevious24h} yesterday`
        },
        inProgress: {
          value: inProgressTrend,
          isPositive: parseFloat(inProgressTrend) > 0, // More in progress is better
          comparison: `${inProgressLast24h} started in last 24h`
        },
        resolved: {
          value: resolvedTrend,
          isPositive: parseFloat(resolvedTrend) > 0, // More resolved is better
          comparison: `${resolvedThisWeek} this week vs ${resolvedLastWeek} last week`
        },
        avgResolution: {
          value: avgResolutionHours > 0 ? avgResolutionHours.toFixed(1) : '0',
          isPositive: avgResolutionHours < 3, // Under 3 hours is good
          comparison: `Average: ${avgResolutionHours.toFixed(1)} hours`
        }
      }
    };
    
    // Category breakdown
    allIssues.forEach(issue => {
      stats.categoryBreakdown[issue.category] = (stats.categoryBreakdown[issue.category] || 0) + 1;
      stats.priorityBreakdown[issue.priority] = (stats.priorityBreakdown[issue.priority] || 0) + 1;
      stats.statusBreakdown[issue.status] = (stats.statusBreakdown[issue.status] || 0) + 1;
    });
    
    return c.json({ stats });
    
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: `Failed to fetch analytics: ${error.message}` }, 500);
  }
});

// Get user profile by ID (staff/admin only)
app.get("/make-server-f232df90/admin/users/:userId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    
    if (profile?.role !== 'staff' && profile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Staff/Admin access required' }, 403);
    }
    
    const targetUserId = c.req.param('userId');
    const targetProfile = await getUserProfile(targetUserId);
    
    if (!targetProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ profile: targetProfile });
    
  } catch (error) {
    console.log(`Error fetching user profile: ${error}`);
    return c.json({ error: `Failed to fetch user profile: ${error.message}` }, 500);
  }
});

// Get AI predictions for maintenance issues (staff/admin only)
app.get("/make-server-f232df90/admin/predictions", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    
    if (profile?.role !== 'staff' && profile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Staff/Admin access required' }, 403);
    }
    
    const allIssues = await getAllIssues();
    
    // AI Prediction Algorithm: Analyze patterns to predict potential issues
    const predictions: any[] = [];
    
    // 1. Find locations with recurring issues (3+ issues in same room)
    const locationIssueCount: Record<string, any[]> = {};
    allIssues.forEach(issue => {
      const locationKey = `${issue.room}-${issue.building}`;
      if (!locationIssueCount[locationKey]) {
        locationIssueCount[locationKey] = [];
      }
      locationIssueCount[locationKey].push(issue);
    });
    
    // Generate predictions for high-frequency locations
    Object.entries(locationIssueCount).forEach(([location, issues]) => {
      if (issues.length >= 3) {
        // Analyze category patterns
        const categoryCount: Record<string, number> = {};
        issues.forEach(issue => {
          categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
        });
        
        // Find most common category
        const mostCommonCategory = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])[0];
        
        if (mostCommonCategory) {
          const [room, building] = location.split('-');
          predictions.push({
            id: `pred-${location}-${mostCommonCategory[0]}`,
            type: 'recurring_pattern',
            title: `Potential ${mostCommonCategory[0]} issue in ${room}`,
            description: `This location has had ${issues.length} issues, ${mostCommonCategory[1]} related to ${mostCommonCategory[0]}. Proactive inspection recommended.`,
            room: room,
            building: building,
            category: mostCommonCategory[0],
            confidence: Math.min(95, 60 + (issues.length * 10)),
            priority: issues.length >= 5 ? 'high' : 'medium',
            basedOnIssues: issues.length,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
    
    // 2. Find recently resolved issues that might recur
    const recentlyResolved = allIssues.filter(issue => 
      issue.status === 'resolved' && 
      issue.category === 'Equipment' || issue.category === 'Electrical'
    );
    
    recentlyResolved.slice(0, 3).forEach(issue => {
      predictions.push({
        id: `pred-followup-${issue.id}`,
        type: 'maintenance_followup',
        title: `Follow-up inspection: ${issue.title}`,
        description: `${issue.category} issues often recur. Schedule preventive maintenance check.`,
        room: issue.room,
        building: issue.building,
        category: issue.category,
        confidence: 70,
        priority: 'low',
        basedOnIssues: 1,
        createdAt: new Date().toISOString(),
      });
    });
    
    // 3. Identify high-priority patterns
    const highPriorityIssues = allIssues.filter(i => i.priority === 'high' || i.priority === 'critical');
    const categoryFrequency: Record<string, number> = {};
    
    highPriorityIssues.forEach(issue => {
      categoryFrequency[issue.category] = (categoryFrequency[issue.category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory && topCategory[1] >= 2) {
      predictions.push({
        id: `pred-trending-${topCategory[0]}`,
        type: 'trending_category',
        title: `${topCategory[0]} issues trending upward`,
        description: `Campus-wide increase in ${topCategory[0]} issues detected. ${topCategory[1]} high-priority cases recently. Consider department-wide inspection.`,
        room: 'Multiple Locations',
        building: 'Campus-wide',
        category: topCategory[0],
        confidence: 85,
        priority: 'high',
        basedOnIssues: topCategory[1],
        createdAt: new Date().toISOString(),
      });
    }
    
    // Sort by confidence and priority
    predictions.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return b.confidence - a.confidence;
    });
    
    // Return top 5 predictions
    return c.json({ predictions: predictions.slice(0, 5) });
    
  } catch (error) {
    console.log(`Error generating predictions: ${error}`);
    return c.json({ error: `Failed to generate predictions: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);