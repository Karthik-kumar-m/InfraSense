import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SentimentIndicator } from './SentimentIndicator';
import { Logo } from './Logo';
import { createIssue } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { 
  QrCode, 
  Upload, 
  X, 
  ArrowLeft, 
  AlertCircle,
  Camera,
  MapPin
} from 'lucide-react';

interface ReportIssueFormProps {
  onSubmit: (data: IssueFormData) => void;
  onCancel: () => void;
}

interface IssueFormData {
  category: string;
  room: string;
  building: string;
  floor: string;
  description: string;
  title: string;
  imageUrl?: string;
}

export function ReportIssueForm({ onSubmit, onCancel }: ReportIssueFormProps) {
  const [formData, setFormData] = useState<IssueFormData>({
    category: '',
    title: '',
    room: '',
    building: '',
    floor: '',
    description: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sentimentLevel, setSentimentLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Equipment',
    'Facilities',
    'Furniture',
    'Electrical',
    'Plumbing',
    'HVAC',
    'Cleaning',
    'Security',
    'Network/IT',
    'Other',
  ];

  const buildings = ['Building A', 'Building B', 'Building C', 'Building D', 'Library', 'Student Center'];

  const handleQrScan = () => {
    // Mock QR scan - auto-fill room details
    setFormData({
      ...formData,
      building: 'Building A',
      floor: '3',
      room: '301',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: undefined });
  };

  // Simple sentiment analysis based on keywords
  const analyzeSentiment = (text: string): 'low' | 'medium' | 'high' => {
    const urgentWords = ['urgent', 'emergency', 'broken', 'dangerous', 'immediate', 'critical'];
    const moderateWords = ['not working', 'damaged', 'needs', 'issue', 'problem'];
    
    const lowerText = text.toLowerCase();
    
    if (urgentWords.some(word => lowerText.includes(word))) {
      return 'high';
    } else if (moderateWords.some(word => lowerText.includes(word))) {
      return 'medium';
    }
    return 'low';
  };

  const handleDescriptionChange = (text: string) => {
    setFormData({ ...formData, description: text });
    if (text.length > 10) {
      setSentimentLevel(analyzeSentiment(text));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const issueData = {
        ...formData,
        location: `${formData.building}, Floor ${formData.floor}`,
        priority: sentimentLevel === 'high' ? 'high' : sentimentLevel === 'medium' ? 'medium' : 'low',
        sentiment: sentimentLevel,
      };
      await createIssue(issueData);
      toast.success('Issue reported successfully!');
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error('Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.category && formData.building && formData.room && formData.description;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-foreground">Report Issue</h2>
                <p className="text-sm text-muted-foreground">Help us improve our campus</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* QR Scan Section */}
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-foreground mb-1">Quick Scan</h4>
                <p className="text-sm text-muted-foreground">
                  Scan the QR code in the room to auto-fill location details
                </p>
              </div>
              <Button type="button" onClick={handleQrScan} className="shrink-0">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </Card>

          {/* Location Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Location Details</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building">Building</Label>
                  <Select value={formData.building} onValueChange={(value) => setFormData({ ...formData, building: value })}>
                    <SelectTrigger className="bg-input-background">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building} value={building}>
                          {building}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="text"
                    placeholder="e.g., 3"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  type="text"
                  placeholder="e.g., 301"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="bg-input-background"
                />
              </div>
            </div>
          </Card>

          {/* Issue Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Issue Details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter a title for the issue..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="bg-input-background min-h-32 resize-none"
                />
                {formData.description.length > 10 && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">Detected urgency:</span>
                    <SentimentIndicator level={sentimentLevel} />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Image Upload */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Add Photo (Optional)</h3>
            </div>

            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Issue preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}