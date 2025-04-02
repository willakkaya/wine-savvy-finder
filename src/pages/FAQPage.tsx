
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Wine, GlassWater, DollarSign, MapPin, HeartHandshake, HelpCircle } from 'lucide-react';

const FAQPage: React.FC = () => {
  const faqSections = [
    {
      title: "About Wine Whisperer",
      icon: <Wine className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "What is Wine Whisperer?",
          answer: "Wine Whisperer is an app that helps you find the best value wines on restaurant wine lists. Simply take a photo of a wine list, and our AI will identify which wines offer the best value compared to their retail prices."
        },
        {
          question: "How does Wine Whisperer work?",
          answer: "Our app uses optical character recognition (OCR) to read wine lists, then compares the prices to a database of retail and market values. We calculate a value score based on the restaurant markup compared to typical market rates."
        },
        {
          question: "Is Wine Whisperer free to use?",
          answer: "The basic features of Wine Whisperer are free to use. We offer a premium subscription that provides additional features such as unlimited scans, detailed tasting notes, and cellar tracking."
        }
      ]
    },
    {
      title: "Using the App",
      icon: <HelpCircle className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "How do I scan a wine list?",
          answer: "Go to the Scan page, tap the camera button, and take a clear photo of the wine list. Make sure the text is readable and the lighting is good. Our AI will process the image and return results within seconds."
        },
        {
          question: "Can I save wines I like?",
          answer: "Yes! Tap the heart icon on any wine to save it to your Favorites. You can access your saved wines anytime from the Favorites page in the app."
        },
        {
          question: "What if the app can't recognize a wine list?",
          answer: "For best results, ensure good lighting and a clear, straight-on photo of the list. If the app still has trouble, you can try taking separate photos of different sections of the list, or manually search for specific wines."
        }
      ]
    },
    {
      title: "Wine Preferences",
      icon: <GlassWater className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "How do I set my wine preferences?",
          answer: "You can set your wine preferences in the Settings page or when you first start using the app. We'll ask about your preferred varietals, regions, taste profile, price range, and any allergens to provide more personalized recommendations."
        },
        {
          question: "Can I change my preferences later?",
          answer: "Absolutely! You can update your preferences anytime from the Settings page. Just tap on 'Wine Preferences' and make any changes you'd like."
        },
        {
          question: "How do my preferences affect recommendations?",
          answer: "Your preferences help us highlight wines that match your taste profile when you scan a wine list. Wines that align with your preferences will receive a special indication in the results."
        }
      ]
    },
    {
      title: "Value Scores",
      icon: <DollarSign className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "What is a Value Score?",
          answer: "A Value Score is our rating from 0-100 that indicates how good of a deal a wine is compared to its typical retail price. Higher scores mean better value (lower markup compared to average restaurant pricing)."
        },
        {
          question: "How are Value Scores calculated?",
          answer: "We compare the restaurant's price to average retail prices and typical restaurant markups. Wines priced closer to retail receive higher scores, while those with excessive markups score lower."
        },
        {
          question: "Does a low Value Score mean the wine is bad?",
          answer: "Not at all! A low Value Score only means the price has a higher markup compared to its retail value. The wine itself might be excellent - it's just not the best financial value on the list."
        }
      ]
    },
    {
      title: "Wine Regions",
      icon: <MapPin className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "Why do region and vintage matter?",
          answer: "Wine quality and character can vary significantly based on the region and year it was produced. Certain vintages from specific regions are considered exceptional, while others might be less desirable."
        },
        {
          question: "Which regions typically offer good value?",
          answer: "Emerging wine regions often offer excellent value compared to established prestigious regions. Look for wines from Portugal, Chile, South Africa, and lesser-known areas of Spain, Italy, and the United States."
        }
      ]
    },
    {
      title: "Support & Feedback",
      icon: <HeartHandshake className="h-5 w-5 text-wine" />,
      questions: [
        {
          question: "How can I report an issue with the app?",
          answer: "You can report issues through the Contact page in the app, or email support@winewhisperer.com. Please include as much detail as possible, including screenshots if applicable."
        },
        {
          question: "Can I suggest new features?",
          answer: "We love hearing your ideas! Send feature requests through our Contact page or email ideas@winewhisperer.com. We're always looking to improve the app based on user feedback."
        },
        {
          question: "Is my data private?",
          answer: "Yes, we take your privacy seriously. We only collect data necessary to improve the app functionality. Wine lists you scan are processed securely and not shared with third parties. Please see our Privacy Policy for complete details."
        }
      ]
    }
  ];

  return (
    <PageContainer title="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif text-wine-dark text-center mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything you need to know about using Wine Whisperer to find great value wines
        </p>

        <div className="space-y-8">
          {faqSections.map((section, index) => (
            <div key={index} className="rounded-lg border border-border p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-xl font-serif font-medium text-foreground">{section.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`} className="border-0">
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-3 px-4 rounded-md hover:bg-muted">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 pt-1 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default FAQPage;
