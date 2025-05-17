'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ArrowRight, Edit3, Bookmark, Clock, Zap, CheckCircle, User, Lock } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
      {/* Navigation Bar */}
      <header className="py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-blue-500" />
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
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.07]"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="flex-1 text-center lg:text-left space-y-5 max-w-2xl">
              <div className="flex justify-center lg:justify-start">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Content Creation Made Simple</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300">
                  Modern Blog Editor
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">for Creative Writers</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
                Create, edit, and manage your blog posts with our powerful editor featuring auto-save, live preview, and intuitive interface.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4 animate-fade-in-delayed-more">
                <Link href="/blog">
                  <Button size="lg" className="rounded-full px-6 group">
                    View My Blogs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/blog/new">
                  <Button variant="outline" size="lg" className="rounded-full px-6 border-2">
                    Create New Blog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative md:w-2/5 lg:w-auto">
              <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* More realistic representation of the app interface */}
                <div className="h-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  {/* Mock editor interface */}
                  <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 mb-4">
                    <div className="h-7 mb-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-24 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Content Creators</h2>
            <p className="text-gray-600 dark:text-gray-300">Everything you need to create, manage, and publish your blog content efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
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
