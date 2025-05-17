'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Menu, X, Home, BookOpen, PlusCircle, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Initialize component on client side
  useEffect(() => {
    setMounted(true);
    // Try to get username from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsername(userData.username || userData.email?.split('@')[0] || 'User');
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);
    const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Handle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      // Clear any stored user data
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
    
    // Close the mobile menu if open
    setIsOpen(false);
  };

  // Define navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/blog', label: 'My Blogs', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/blog/new', label: 'New Blog', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  // Only render if mounted (client side)
  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-950/90 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <nav className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-primary text-white font-medium rounded-md w-8 h-8 flex items-center justify-center shadow-sm">B</span>
            <span className="font-semibold text-xl hidden sm:inline-block">Blog Editor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={item.href}>
                  <Button 
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center gap-1.5"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={toggleTheme} size="icon">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2 border rounded-full px-3 py-1">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium">{username || 'User'}</span>
            </div>
            
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-4 border-t mt-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center">
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-medium">{username || 'User'}</span>
                  </div>
                  <Button variant="ghost" onClick={toggleTheme} size="sm">
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </div>
              </li>
              <li>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
