'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ArrowRight, Edit3, Bookmark, Clock, Zap, CheckCircle, User, Lock, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Add a footer component
  const Footer = () => (
    <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-lg">BlogEditor</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The modern platform for content creators and bloggers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  My Blogs
                </Link>
              </li>
              <li>
                <Link href="/blog/new" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Create New Blog
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} BlogEditor. All rights reserved.
        </div>
      </div>
    </footer>
  );
  
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Navigation Bar */}
        <header className="py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container px-4 mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="subtle-effect">
                <Edit3 className="h-6 w-6 text-blue-500" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">BlogEditor</span>
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                My Blogs
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Privacy
              </Link>
            </nav>
            <div className="flex gap-3 items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full hover:scale-110 transition-transform"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="flex items-center gap-2 glitter">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 bg-grid-pattern relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/10 dark:to-gray-950"></div>
          
          {/* Subtle background elements */}
          <div className="absolute top-20 right-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-5"></div>
          <div className="absolute top-40 left-1/4 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white animate-fade-in">
                Create, Edit, Publish Your Blog Posts with Ease
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-delayed">
                A modern, intuitive platform for bloggers and content creators to manage their writing workflow efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto group shadow-sm">
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto shadow-sm">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Curved divider */}
        <div className="relative bg-white dark:bg-gray-950">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto -mt-px">
            <path 
              fill="currentColor" 
              className="text-slate-50 dark:text-gray-900"
              d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,106.7C672,107,768,149,864,154.7C960,160,1056,128,1152,106.7C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-3">Powerful Features for Content Creators</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to create, manage, and publish your blog content efficiently.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <Edit3 className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">Rich Text Editor</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Powerful WYSIWYG editor with formatting options, image uploads, and more.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <Bookmark className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">Auto-Save</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Never lose your work with automatic saving that works even when offline.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <Clock className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">Version History</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Track changes and revert to previous versions of your content anytime.</p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <Zap className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">Fast Performance</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Optimized for speed with instant loading and responsive design.</p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <CheckCircle className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">SEO Optimization</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Built-in tools to help your content rank better in search engines.</p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-md flex items-center justify-center mb-4">
                  <Lock className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure Storage</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your content is encrypted and securely stored with regular backups.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 dark:text-gray-300">Simple steps to start creating your blog content</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">1. Create Account</h3>
                <p className="text-gray-600 dark:text-gray-300">Sign up for free and set up your writer profile</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                  <Edit3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">2. Create Content</h3>
                <p className="text-gray-600 dark:text-gray-300">Use our intuitive editor to write and format your blogs</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">3. Publish</h3>
                <p className="text-gray-600 dark:text-gray-300">Publish instantly or save drafts for later</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500 to-cyan-400 dark:from-blue-600 dark:to-cyan-500">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Creating?</h2>
              <p className="text-white/90 mb-8">Join thousands of content creators who trust our platform for their blogging needs.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-blue-600">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

const featuresData = [
  {
    icon: <Edit3 className="w-6 h-6 text-blue-600" />,
    title: "Rich Text Editor",
    description: "Powerful editing tools that make formatting your content a breeze with real-time preview."
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: "Auto-Save Drafts",
    description: "Never lose your work with automatic saving that works even when you're offline."
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "Fast Publishing",
    description: "One-click publishing to make your content immediately available to your audience."
  },
  {
    icon: <Lock className="w-6 h-6 text-blue-600" />,
    title: "Secure",
    description: "Your content is safe with enterprise-grade security and regular backups."
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
    title: "User Friendly",
    description: "Intuitive interface that makes blog management simple for beginners and pros alike."
  },
  {
    icon: <Bookmark className="w-6 h-6 text-blue-600" />,
    title: "Content Organization",
    description: "Easily organize your posts with tags, categories, and powerful search features."
  }
];
