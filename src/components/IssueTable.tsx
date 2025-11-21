import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import { getIssues } from '../utils/api';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  category: string;
  room: string;
  building: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  studentName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface IssueTableProps {
  onBack: () => void;
  onViewIssue: (id: string) => void;
}

type SortField = 'createdAt' | 'priority' | 'status' | 'room';
type SortDirection = 'asc' | 'desc';

export function IssueTable({ onBack, onViewIssue }: IssueTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      console.log('[IssueTable] Loading issues...');
      const issues = await getIssues();
      console.log('[IssueTable] Loaded issues:', issues);
      setAllIssues(issues || []);
    } catch (error: any) {
      console.error('[IssueTable] Error loading issues:', error);
      toast.error('Failed to load issues: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  // Filter and sort issues
  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }).sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-foreground">All Issues</h2>
              <p className="text-sm text-muted-foreground">Manage and track all reported issues</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-foreground">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, room, or student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Network/IT">Network/IT</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            Showing {filteredIssues.length} of {allIssues.length} issues
          </p>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date
                      {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Issue</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort('room')}
                    >
                      Location
                      {getSortIcon('room')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {getSortIcon('status')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                      {getSortIcon('priority')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Assigned To</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr 
                    key={issue.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onViewIssue(issue.id)}
                  >
                    <td className="p-4">
                      <p className="text-sm text-foreground">{formatDate(issue.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground mb-1">{issue.title}</p>
                      <p className="text-sm text-muted-foreground">{issue.category}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{issue.room}</p>
                      <p className="text-sm text-muted-foreground">{issue.building}</p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{issue.assignedTo || 'Unassigned'}</p>
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewIssue(issue.id);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}