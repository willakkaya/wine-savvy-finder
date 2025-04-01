
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
              Welcome to {config.appName} ("we," "our," or "us"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wine list images you upload through our app</li>
              <li>Your saved wine preferences and history</li>
              <li>Device information and app usage statistics</li>
              <li>Information you provide when creating an account (if applicable)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our wine recommendation service</li>
              <li>Analyze wine list images to identify wines and their prices</li>
              <li>Personalize your experience with relevant wine recommendations</li>
              <li>Communicate with you about app features and updates</li>
              <li>Maintain and improve the app's functionality and security</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">4. Sharing Your Information</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who help us operate our business</li>
              <li>Wine data partners who help us provide accurate pricing information</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">5. Your Choices</h2>
            <p className="mb-3">
              You can control your information by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Updating or deleting your account information</li>
              <li>Opting out of marketing communications</li>
              <li>Adjusting your device settings for app permissions</li>
              <li>Requesting access to or deletion of your data</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">6. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@winewhisperer.com.
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
