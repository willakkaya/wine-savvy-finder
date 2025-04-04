
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Separator } from '@/components/ui/separator';
import { config } from '@/lib/config';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-serif mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <Separator className="mb-6" />
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-3">1. Introduction</h2>
            <p>
              Welcome to {config.appName}'s Privacy Policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in various ways:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Data:</strong> Includes email address, name, and phone number when you create an account.</li>
              <li><strong>Usage Data:</strong> Information on how you access and use the app, including wine lists you've scanned.</li>
              <li><strong>Device Data:</strong> Information about your mobile device including device type, operating system, and unique device identifiers.</li>
              <li><strong>Location Data:</strong> With your consent, we may collect your precise location to enhance your experience.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">3. Use of Your Information</h2>
            <p className="mb-3">We use the collected information for various purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">4. Disclosure of Your Information</h2>
            <p>
              We may share your information with third-party service providers to monitor and analyze the use of our service, to contact you, or as required by law.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">5. Security of Your Personal Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">6. Your Data Protection Rights</h2>
            <p>
              You have certain data protection rights including the right to access, update, or delete your personal information, object to processing, and data portability.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">7. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of {config.legal.minimumAge}. We do not knowingly collect personally identifiable information from anyone under the age of {config.legal.minimumAge}.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at {config.support.email}.
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

export default PrivacyPolicy;
