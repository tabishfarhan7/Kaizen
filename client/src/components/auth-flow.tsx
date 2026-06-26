import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowLeft, GitBranch as Github, User, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupStep1Schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupStep2Schema = z.object({
  targetCompany: z.string().min(1, { message: 'Please enter a target company' }),
});

const signupStep3Schema = z.object({
  techStack: z.string().min(1, { message: 'Please enter your primary tech stack' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupStep1Values = z.infer<typeof signupStep1Schema>;

interface AuthFlowProps {
  onAuthSuccess: (user: any) => void;
  onBackToLanding: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthSuccess, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { setCandidateProfile } = useAuthStore();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<any>({
    resolver: zodResolver(
      signupStep === 1 ? signupStep1Schema : 
      signupStep === 2 ? signupStep2Schema : 
      signupStep3Schema
    ),
    mode: 'onSubmit',
    defaultValues: {
      name: '', email: '', password: '', targetCompany: '', techStack: ''
    }
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await authService.login(data);
      onAuthSuccess({
        id: res.user?.id,
        name: res.user?.name || data.email.split('@')[0],
        email: res.user?.email || data.email,
        isGuest: false,
      });
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onSignupNext = async () => {
    const isValid = await signupForm.trigger();
    if (isValid) {
      setSignupStep(prev => prev + 1);
    }
  };

  const onSignupSubmit = async (data: any) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      // Save profile preferences
      setCandidateProfile({
        techStack: data.techStack.split(',').map((s: string) => s.trim()),
        topics: ['System Design', 'Algorithms'],
        strengths: [],
        weaknesses: [],
      });

      onAuthSuccess({
        id: res.user?.id,
        name: res.user?.name || data.name,
        email: res.user?.email || data.email,
        isGuest: false,
      });
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
      <button
        onClick={onBackToLanding}
        className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors z-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>

      {/* Left Panel */}
      <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight gap-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <Cpu className="h-5 w-5 text-zinc-950" />
          </div>
          KAIZEN
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              "Kaizen's real-time telemetry fundamentally changed how I approached system design interviews."
            </p>
            <footer className="text-sm font-semibold text-zinc-400">Sofia Davis, Sr. Backend Engineer</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="p-8 h-full flex items-center justify-center w-full relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          
          <div className="flex flex-col space-y-2 text-center mb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-zinc-500">
              {activeTab === 'signin' ? 'Enter your credentials to continue' : 'Let\'s personalize your interview experience'}
            </p>
          </div>

          <div className="grid grid-cols-2 bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('signin'); setApiError(''); }}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'signin' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setApiError(''); setSignupStep(1); }}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'signup' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="grid gap-6">
            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                <motion.form 
                  key="signin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)} 
                  className="grid gap-4"
                >
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-950">Email</label>
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                    {loginForm.formState.errors.email && <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-950">Password</label>
                    <input
                      {...loginForm.register('password')}
                      type="password"
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                    {loginForm.formState.errors.password && <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>}
                  </div>
                  {apiError && <p className="text-xs font-bold text-red-500 text-center">{apiError}</p>}
                  <Button disabled={loading} className="w-full mt-2 h-10">
                    {loading ? <div className="h-4 w-4 rounded-full border-2 border-zinc-400 border-t-white animate-spin" /> : 'Sign In'}
                  </Button>
                </motion.form>
              ) : (
                <motion.form 
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={signupForm.handleSubmit(signupStep === 3 ? onSignupSubmit : onSignupNext)} 
                  className="grid gap-4"
                >
                  {/* Step Indicators */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={`h-2 rounded-full transition-all ${signupStep >= step ? 'w-8 bg-zinc-950' : 'w-4 bg-zinc-200'}`} />
                    ))}
                  </div>

                  {signupStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium text-zinc-950">Full Name</label>
                        <input
                          {...signupForm.register('name')}
                          type="text"
                          placeholder="John Doe"
                          className="flex h-10 w-full rounded-md border border-zinc-200 px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-950"
                        />
                        {signupForm.formState.errors.name && <p className="text-xs text-red-500">{signupForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium text-zinc-950">Email</label>
                        <input
                          {...signupForm.register('email')}
                          type="email"
                          placeholder="john@example.com"
                          className="flex h-10 w-full rounded-md border border-zinc-200 px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-950"
                        />
                        {signupForm.formState.errors.email && <p className="text-xs text-red-500">{signupForm.formState.errors.email.message as string}</p>}
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium text-zinc-950">Password</label>
                        <input
                          {...signupForm.register('password')}
                          type="password"
                          className="flex h-10 w-full rounded-md border border-zinc-200 px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-950"
                        />
                        {signupForm.formState.errors.password && <p className="text-xs text-red-500">{signupForm.formState.errors.password.message as string}</p>}
                      </div>
                    </motion.div>
                  )}

                  {signupStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-2 text-center">
                        <h3 className="font-bold text-indigo-900 text-sm mb-1">Target Company</h3>
                        <p className="text-xs text-indigo-700">Which company are you interviewing for? (e.g. Google, Meta, Stripe)</p>
                      </div>
                      <div className="grid gap-1.5">
                        <input
                          {...signupForm.register('targetCompany')}
                          type="text"
                          placeholder="e.g. Google"
                          className="flex h-12 text-center text-lg font-bold w-full rounded-md border border-zinc-200 px-3 shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                        {signupForm.formState.errors.targetCompany && <p className="text-xs text-red-500 text-center">{signupForm.formState.errors.targetCompany.message as string}</p>}
                      </div>
                    </motion.div>
                  )}

                  {signupStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-2 text-center">
                        <h3 className="font-bold text-emerald-900 text-sm mb-1">Primary Tech Stack</h3>
                        <p className="text-xs text-emerald-700">What languages/frameworks do you use? (Comma separated)</p>
                      </div>
                      <div className="grid gap-1.5">
                        <input
                          {...signupForm.register('techStack')}
                          type="text"
                          placeholder="React, Node.js, Python"
                          className="flex h-12 text-center font-medium w-full rounded-md border border-zinc-200 px-3 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
                        />
                        {signupForm.formState.errors.techStack && <p className="text-xs text-red-500 text-center">{signupForm.formState.errors.techStack.message as string}</p>}
                      </div>
                    </motion.div>
                  )}

                  {apiError && <p className="text-xs font-bold text-red-500 text-center">{apiError}</p>}
                  
                  <div className="flex gap-2 mt-2">
                    {signupStep > 1 && (
                      <Button type="button" variant="outline" onClick={() => setSignupStep(prev => prev - 1)} className="w-1/3">
                        Back
                      </Button>
                    )}
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? <div className="h-4 w-4 rounded-full border-2 border-zinc-400 border-t-white animate-spin" /> : 
                       signupStep < 3 ? 'Continue' : 'Complete Setup'}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => onAuthSuccess({ name: 'Guest', email: 'guest@mock.com' })} className="w-full">
                <User className="mr-2 h-4 w-4" /> Guest
              </Button>
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
