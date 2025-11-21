import { projectId, publicAnonKey } from './supabase/info.tsx';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f232df90`;

// Auth storage
const AUTH_KEY = 'infrasense_auth';

export interface AuthData {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
  profile: {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'staff' | 'admin';
    department?: string;
    studentId?: string;
  };
}

// Storage helpers
export function saveAuth(authData: AuthData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

export function getAuth(): AuthData | null {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

// API helper function
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<any> {
  const auth = getAuth();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Always include authorization header
  // Use user's access token if available and required, otherwise use public anon key
  if (requiresAuth && auth?.accessToken) {
    headers['Authorization'] = `Bearer ${auth.accessToken}`;
  } else {
    // For public endpoints and when no user auth exists, use anon key
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', {
        endpoint,
        status: response.status,
        error: data.error,
        data
      });
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('API Request Error:', {
      endpoint,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// ==================== AUTH API ====================

export async function signup(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'staff' | 'admin' = 'student',
  studentId?: string,
  department?: string
) {
  const data = await apiRequest(
    '/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, studentId, department }),
    },
    false
  );
  
  return data;
}

export async function signin(email: string, password: string) {
  const data = await apiRequest(
    '/auth/signin',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false
  );
  
  if (data.accessToken) {
    const authData: AuthData = {
      accessToken: data.accessToken,
      user: data.user,
      profile: data.profile,
    };
    saveAuth(authData);
  }
  
  return data;
}

export async function signout() {
  try {
    await apiRequest('/auth/signout', { method: 'POST' });
  } finally {
    clearAuth();
  }
}

export async function getSession() {
  const data = await apiRequest('/auth/session');
  return data;
}

// ==================== ISSUES API ====================

export async function createIssue(issueData: {
  title: string;
  description: string;
  category: string;
  location: string;
  room: string;
  building: string;
  floor?: string;
  priority?: string;
  sentiment?: string;
  imageUrl?: string;
  tags?: string[];
}) {
  console.log('[API createIssue] Creating issue with data:', issueData);
  console.log('[API createIssue] Auth data:', getAuth());
  
  const data = await apiRequest('/issues', {
    method: 'POST',
    body: JSON.stringify(issueData),
  });
  
  console.log('[API createIssue] Issue created successfully:', data);
  
  return data;
}

export async function getIssues(status?: string, department?: string) {
  let url = '/issues';
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (department) params.append('department', department);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  console.log('[API getIssues] Calling endpoint:', url);
  console.log('[API getIssues] Auth data:', getAuth());
  
  const data = await apiRequest(url);
  
  console.log('[API getIssues] Response data:', data);
  console.log('[API getIssues] Issues array:', data.issues);
  console.log('[API getIssues] Issues count:', data.issues?.length || 0);
  
  return data.issues;
}

export async function getIssue(id: string) {
  const data = await apiRequest(`/issues/${id}`);
  return data.issue;
}

export async function updateIssue(id: string, updates: any) {
  const data = await apiRequest(`/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.issue;
}

export async function upvoteIssue(id: string) {
  const data = await apiRequest(`/issues/${id}/upvote`, {
    method: 'POST',
  });
  return data.issue;
}

// ==================== GAMIFICATION API ====================

export async function getGamification() {
  const data = await apiRequest('/gamification');
  return data.gamification;
}

export async function getLeaderboard(limit = 10) {
  const data = await apiRequest(`/gamification/leaderboard?limit=${limit}`);
  return data.leaderboard;
}

// ==================== ADMIN API ====================

export async function getAnalytics() {
  const data = await apiRequest('/admin/analytics');
  return data.stats;
}

export async function getUserProfile(userId: string) {
  const data = await apiRequest(`/admin/users/${userId}`);
  return data.profile;
}

export async function getPredictions() {
  const data = await apiRequest('/admin/predictions');
  return data.predictions;
}