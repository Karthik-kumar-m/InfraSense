import * as kv from './kv_store.tsx';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
  department?: string;
  studentId?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
  const now = new Date().toISOString();
  
  const newProfile: UserProfile = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };
  
  await kv.set(`user:${profile.id}`, newProfile);
  await kv.set(`user-email:${profile.email}`, profile.id);
  
  return newProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const profile = await kv.get(`user:${userId}`);
  return profile as UserProfile | null;
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const userId = await kv.get(`user-email:${email}`);
  if (!userId) return null;
  
  return getUserProfile(userId as string);
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  
  const updatedProfile: UserProfile = {
    ...profile,
    ...updates,
    id: userId,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`user:${userId}`, updatedProfile);
  return updatedProfile;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const allUsers = await kv.getByPrefix('user:');
  return allUsers
    .map(item => item.value as UserProfile)
    .filter(user => user && user.id && !user.id.includes(':'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUsersByRole(role: string): Promise<UserProfile[]> {
  const allUsers = await getAllUsers();
  return allUsers.filter(user => user.role === role);
}
