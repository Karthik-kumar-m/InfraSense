import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SentimentIndicator } from './SentimentIndicator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  MessageSquare,
  Upload,
  X,
  Send
} from 'lucide-react';

interface StaffIssueDetailsProps {
  onBack: () => void;
}

export function StaffIssueDetails({ onBack }: StaffIssueDetailsProps) {
  const [newRemark, setNewRemark] = useState('');
  const [newStatus, setNewStatus] = useState('in-progress');
  const [proofImage, setProofImage] = useState<string | null>(null);

  const issue = {
    id: '1',
    title: 'Broken projector in classroom',
    category: 'Equipment',
    room: 'Room 301',
    building: 'Building A',
    floor: '3',
    status: 'in-progress' as const,
    priority: 'high' as const,
    sentiment: 'high' as const,
    description: 'The projector in Room 301 is not turning on. This is urgent as we have a presentation scheduled for tomorrow morning.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    createdAt: '2024-11-20T10:30:00',
    studentName: 'John Doe',
    studentId: 'STU123456',
    assignedStaff: {
      name: 'Mike Smith',
      role: 'Maintenance Technician',
      department: 'Facilities',
    },
    expectedResolution: '2024-11-21T14:00:00',
  };

  const remarks = [
    {
      id: '1',
      user: 'System',
      message: 'Issue automatically assigned based on category and workload',
      timestamp: '2024-11-20T10:45:00',
      isSystem: true,
    },
    {
      id: '2',
      user: 'Mike Smith',
      message: 'Inspected the projector. The bulb has burned out and needs replacement.',
      timestamp: '2024-11-20T14:20:00',
      isSystem: false,
    },
    {
      id: '3',
      user: 'Mike Smith',
      message: 'Ordered replacement parts. Will be installed tomorrow morning.',
      timestamp: '2024-11-20T16:00:00',
      isSystem: false,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRemark = () => {
    if (newRemark.trim()) {
      // In a real app, this would send the remark to the backend
      console.log('Adding remark:', newRemark);
      setNewRemark('');
    }
  };

  const handleUpdateStatus = () => {
    // In a real app, this would update the status in the backend
    console.log('Updating status to:', newStatus);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-foreground">Issue Management</h2>
              <p className="text-sm text-muted-foreground">Update status and add remarks</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">{issue.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                    <SentimentIndicator level={issue.sentiment} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{issue.room}, {issue.building}, Floor {issue.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Reported on {formatDate(issue.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Expected resolution: {formatDate(issue.expectedResolution)}</span>
                    </div>
                  </div>
                </div>

                {issue.imageUrl && (
                  <div className="w-full md:w-64">
                    <img 
                      src={issue.imageUrl} 
                      alt="Issue" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h4 className="text-foreground mb-3">Description</h4>
              <p className="text-muted-foreground">{issue.description}</p>
            </Card>

            {/* Update Status */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Update Status</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Change Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUpdateStatus} className="w-full">
                      Update Status
                    </Button>
                  </div>
                </div>

                {/* Upload Proof */}
                <div className="space-y-2">
                  <Label>Upload Fix Proof (Optional)</Label>
                  {proofImage ? (
                    <div className="relative">
                      <img 
                        src={proofImage} 
                        alt="Proof" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setProofImage(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload proof of fix</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </Card>

            {/* Remarks */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h4 className="text-foreground">Remarks & Updates</h4>
              </div>

              <div className="space-y-4 mb-6">
                {remarks.map((remark) => (
                  <div 
                    key={remark.id} 
                    className={`p-4 rounded-lg ${
                      remark.isSystem ? 'bg-muted/50 border border-border' : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="text-foreground">{remark.user}</p>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(remark.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{remark.message}</p>
                  </div>
                ))}
              </div>

              {/* Add New Remark */}
              <div className="space-y-3">
                <Label htmlFor="newRemark">Add Remark</Label>
                <Textarea
                  id="newRemark"
                  placeholder="Add a status update or note..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  className="bg-input-background resize-none"
                  rows={3}
                />
                <Button onClick={handleAddRemark} disabled={!newRemark.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Add Remark
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Info */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Reported By</h4>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {issue.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground">{issue.studentName}</p>
                  <p className="text-sm text-muted-foreground">Student</p>
                  <p className="text-sm text-muted-foreground">{issue.studentId}</p>
                </div>
              </div>
            </Card>

            {/* Assigned Staff */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Assigned To</h4>
              <div className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {issue.assignedStaff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground">{issue.assignedStaff.name}</p>
                  <p className="text-sm text-muted-foreground">{issue.assignedStaff.role}</p>
                  <p className="text-sm text-muted-foreground">{issue.assignedStaff.department}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                Reassign
              </Button>
            </Card>

            {/* Issue Info */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Issue Information</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground">{issue.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Issue ID</p>
                  <p className="text-foreground font-mono">#{issue.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Current Status</p>
                  <StatusBadge status={issue.status} />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Priority</p>
                  <PriorityBadge priority={issue.priority} />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Extend Deadline
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Request Help
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <X className="w-4 h-4 mr-2" />
                  Close Issue
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
