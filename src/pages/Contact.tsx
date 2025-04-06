
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Contact = () => {
  return (
    <PageContainer title="Contact Us" className="bg-background">
      <div className="container max-w-5xl py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions, suggestions, or need assistance? We're here to help.
            Fill out the form below or use our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card/50 border rounded-lg p-8 backdrop-blur">
            <h2 className="text-xl font-medium mb-6">Send us a message</h2>
            <ContactForm />
          </div>
          
          <div>
            <div className="bg-card/50 border rounded-lg p-8 backdrop-blur mb-8">
              <h2 className="text-xl font-medium mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-wine mt-1" />
                  <div>
                    <h3 className="font-medium">Our Office</h3>
                    <address className="not-italic text-muted-foreground">
                      Wine Whisperer HQ<br />
                      123 Vineyard Lane<br />
                      San Francisco, CA 94105
                    </address>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <Phone className="text-wine mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+14155555555" className="hover:text-foreground transition-colors">
                        +1 (415) 555-5555
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monday to Friday, 9am to 6pm PST
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <Mail className="text-wine mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:hello@winewhisperer.com" className="hover:text-foreground transition-colors">
                        hello@winewhisperer.com
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll respond as quickly as possible
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-8 backdrop-blur">
              <h2 className="text-xl font-medium mb-4">Business Hours</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                All times are Pacific Standard Time (PST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Contact;
