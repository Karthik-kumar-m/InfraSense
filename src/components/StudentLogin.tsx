import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap, Mail, Phone, KeyRound } from 'lucide-react';
import { signin, signup } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface StudentLoginProps {
  onLogin: (data: { email?: string; phone?: string; studentId: string }) => void;
}

export function StudentLogin({ onLogin }: StudentLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Sign up new student
        await signup(
          formData.email,
          formData.password,
          formData.name,
          'student',
          formData.studentId
        );
        toast.success('Account created! Please sign in.');
        setIsSignup(false);
      } else {
        // Sign in
        const result = await signin(formData.email, formData.password);
        
        if (result.profile.role !== 'student') {
          toast.error('This account is not a student account');
          return;
        }
        
        toast.success(`Welcome back, ${result.profile.name}!`);
        onLogin({ email: formData.email, studentId: result.profile.studentId || '' });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-foreground mb-2">Student Portal</h1>
          <p className="text-muted-foreground">Sign in to report and track issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input-background"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-input-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="studentId"
                type="text"
                placeholder="STU123456"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="pl-10 bg-input-background"
                required={isSignup}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => setIsSignup(!isSignup)} 
              className="text-primary hover:underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}