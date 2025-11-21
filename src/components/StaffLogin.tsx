import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Mail, Lock } from 'lucide-react';
import { signin, signup } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface StaffLoginProps {
  onLogin: (data: { email: string; password: string; role: string }) => void;
}

export function StaffLogin({ onLogin }: StaffLoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Sign up new staff/admin
        const staffRole = formData.role === 'super-admin' ? 'admin' : formData.role;
        await signup(
          formData.email,
          formData.password,
          formData.name,
          staffRole as 'staff' | 'admin',
          undefined,
          formData.department
        );
        toast.success('Account created! Please sign in.');
        setIsSignup(false);
      } else {
        // Sign in
        const result = await signin(formData.email, formData.password);
        
        if (result.profile.role === 'student') {
          toast.error('This account is not a staff account');
          return;
        }
        
        toast.success(`Welcome back, ${result.profile.name}!`);
        onLogin({ email: formData.email, password: formData.password, role: result.profile.role });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = error.message || 'Authentication failed';
      
      // Provide helpful message for already registered email
      if (isSignup && (errorMessage.includes('already been registered') || errorMessage.includes('already exists'))) {
        toast.error('This email is already registered. Switching to sign in...');
        // Automatically switch to sign in mode
        setTimeout(() => {
          setIsSignup(false);
        }, 2000);
      } else if (!isSignup && (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid credentials'))) {
        toast.error('Invalid email or password. Please check your credentials or sign up for a new account.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-foreground mb-2">Staff Portal</h1>
          <p className="text-muted-foreground">Manage and resolve campus issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="staff@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-input-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 bg-input-background"
              />
            </div>
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input-background"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff Member</SelectItem>
                <SelectItem value="admin">Department Admin</SelectItem>
                <SelectItem value="super-admin">System Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                type="text"
                placeholder="Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-input-background"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-primary hover:underline" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
          </button>
        </div>
      </Card>
    </div>
  );
}