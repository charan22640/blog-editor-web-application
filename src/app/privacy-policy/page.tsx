'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-6 flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Last Updated: May 16, 2025
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
        <p>
          Welcome to Blog Editor. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blog editor service.
          Please read this privacy policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this privacy policy.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">2.1 Personal Information</h3>
        <p>
          We may collect personal information that you voluntarily provide to us when you register for the Blog Editor, such as your name and email address.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">2.2 Blog Content</h3>
        <p>
          We collect and store the content of the blogs you create, including drafts, published posts, and associated metadata such as creation date, update date, and tags.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">2.3 Usage Information</h3>
        <p>
          We automatically collect certain information about your device and how you interact with our service, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Device information (browser type, operating system)</li>
          <li>IP address</li>
          <li>Pages viewed and features used</li>
          <li>Time spent on the platform</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and maintain our service</li>
          <li>Improve, personalize, and expand our service</li>
          <li>Understand how users utilize our service</li>
          <li>Develop new features and functionality</li>
          <li>Communicate with you about service-related announcements</li>
          <li>Prevent fraudulent activities and security issues</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Storage and Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Services</h2>
        <p>
          We may use third-party services to help us operate our service. These third parties may have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use your information for any other purpose.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access to your personal information</li>
          <li>Correction of inaccurate or incomplete information</li>
          <li>Deletion of your personal information</li>
          <li>Restriction or objection to processing</li>
          <li>Data portability</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. Updates to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at: <span className="text-primary">support@blogeditor.com</span>
        </p>
      </div>
    </div>
  );
}
