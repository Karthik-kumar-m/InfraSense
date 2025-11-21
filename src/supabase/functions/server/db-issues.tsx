import * as kv from './kv_store.tsx';

export interface Issue {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  title: string;
  description: string;
  category: string;
  location: string;
  room: string;
  building: string;
  floor?: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sentiment: 'low' | 'medium' | 'high';
  imageUrl?: string;
  assignedTo?: string;
  assignedDepartment?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  upvotes: number;
  tags: string[];
}

export async function createIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const newIssue: Issue = {
    ...issue,
    id,
    createdAt: now,
    updatedAt: now,
  };
  
  await kv.set(`issue:${id}`, newIssue);
  await kv.set(`user-issue:${issue.userId}:${id}`, id);
  
  return newIssue;
}

export async function getIssue(id: string): Promise<Issue | null> {
  const issue = await kv.get(`issue:${id}`);
  return issue as Issue | null;
}

export async function updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | null> {
  const issue = await getIssue(id);
  if (!issue) return null;
  
  const updatedIssue: Issue = {
    ...issue,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`issue:${id}`, updatedIssue);
  return updatedIssue;
}

export async function getUserIssues(userId: string): Promise<Issue[]> {
  const userIssueKeys = await kv.getByPrefix(`user-issue:${userId}:`);
  const issueIds = userIssueKeys.map(item => item.value as string);
  
  const issues = await Promise.all(
    issueIds.map(id => getIssue(id))
  );
  
  return issues.filter(issue => issue !== null) as Issue[];
}

export async function getAllIssues(): Promise<Issue[]> {
  const allIssues = await kv.getByPrefix('issue:');
  return allIssues
    .map(item => item.value as Issue)
    .filter(issue => issue && issue.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getIssuesByStatus(status: string): Promise<Issue[]> {
  const allIssues = await getAllIssues();
  return allIssues.filter(issue => issue.status === status);
}

export async function getIssuesByDepartment(department: string): Promise<Issue[]> {
  const allIssues = await getAllIssues();
  return allIssues.filter(issue => issue.assignedDepartment === department);
}

export async function deleteIssue(id: string): Promise<boolean> {
  const issue = await getIssue(id);
  if (!issue) return false;
  
  await kv.del(`issue:${id}`);
  await kv.del(`user-issue:${issue.userId}:${id}`);
  
  return true;
}

export async function upvoteIssue(id: string): Promise<Issue | null> {
  const issue = await getIssue(id);
  if (!issue) return null;
  
  return updateIssue(id, { upvotes: issue.upvotes + 1 });
}
