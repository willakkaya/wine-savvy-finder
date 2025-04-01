
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Separator } from '@/components/ui/separator';
import { config } from '@/lib/config';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-serif mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <Separator className="mb-6" />
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using {config.appName}, you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any additional terms that may apply. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">2. Description of Service</h2>
            <p>
              {config.appName} provides a mobile application that allows users to scan restaurant wine lists and analyze them for value. We compare restaurant wine prices to market rates to help you identify the best values on any wine list.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">3. User Accounts</h2>
            <p>
              Some features of our service may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">4. User Content</h2>
            <p className="mb-3">
              You retain ownership of any content you submit to the service (such as wine list photos). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display the content in connection with providing and improving our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">5. Intellectual Property</h2>
            <p>
              The {config.appName} application, including its design, text, graphics, logos, icons, and images, as well as the selection, assembly, and arrangement thereof, is the exclusive property of {config.appName} and is protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE SPECIFICALLY DISCLAIM ANY AND ALL WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">7. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL {config.appName.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@winewhisperer.com.
            </p>
          </section>
        </div>
        
        <div className="mt-10 pt-6 border-t">
          <Link to="/" className="text-wine hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default TermsOfService;
