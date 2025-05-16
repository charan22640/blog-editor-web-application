'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-6 flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Last Updated: May 16, 2025
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Agreement to Terms</h2>
        <p>
          These Terms of Service govern your access to and use of the Blog Editor service. By accessing or using our service, you agree to be bound by these Terms and our Privacy Policy.
          If you do not agree to these Terms, you may not access or use the service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Account Registration</h2>
        <p>
          To use certain features of our service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. User Content</h2>
        <p>
          Our service allows you to create, edit, publish, and manage blog content. You retain ownership of any intellectual property rights that you hold in that content.
        </p>
        <p>
          When you submit content to our service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media formats.
        </p>
        <p>
          You represent and warrant that:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You own the content you submit or have the right to grant the rights and licenses described in these Terms</li>
          <li>Your content does not violate the privacy rights, publicity rights, copyrights, contractual rights, intellectual property rights, or any other rights of any person or entity</li>
          <li>Your content does not contain any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Prohibited Uses</h2>
        <p>
          You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," or "spam"</li>
          <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
          <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service, or which may harm the Company or users of the service</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
        <p>
          The Blog Editor service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of the Company and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
        <p>
          In no event shall the Company, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your access to or use of or inability to access or use the service</li>
          <li>Any conduct or content of any third party on the service</li>
          <li>Any content obtained from the service</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
        <p className="mb-8">
          If you have any questions about these Terms, please contact us at: <span className="text-primary">support@blogeditor.com</span>
        </p>
      </div>
    </div>
  );
}
