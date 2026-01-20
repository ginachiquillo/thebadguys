import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What data is distributed by the API?",
    answer: "Our API provides risk scores, red flag indicators, profile metadata analysis, and AI-generated safety assessments. We never share personal contact information or private data. All information is derived from publicly available LinkedIn profiles and crowd-sourced reports from our community."
  },
  {
    question: "What are the API usage limits & restrictions?",
    answer: "Anonymous users can view the top 5 reported profiles. Free registered accounts get 1 profile check per day. Our upcoming subscription tiers will offer higher limits for professionals and organizations. API access for developers is available upon request with custom rate limits."
  },
  {
    question: "Where is The Bad Guys based?",
    answer: "We are a French company based in Europe 🇫🇷. Our servers are hosted in the EU, and we comply with GDPR regulations. We take data privacy seriously and believe everyone deserves protection from online scammers."
  },
  {
    question: "How do I get support?",
    answer: "You can reach our team at contact@thebadguy.com. We typically respond within 24-48 hours. For urgent matters regarding a confirmed scam, please include 'URGENT' in your email subject line."
  },
  {
    question: "How does the risk scoring work?",
    answer: "Our AI analyzes multiple factors including account age, connection patterns, profile photo authenticity, job history consistency, and known scam indicators. Scores range from 0 (safe) to 100 (high risk). Scores above 70 indicate significant red flags that warrant caution."
  },
  {
    question: "Can I report a suspicious profile?",
    answer: "Absolutely! Community reports are vital to our mission. Registered users can submit profiles for review. Our team manually verifies submissions before adding them to the database. You can also contribute evidence and screenshots to strengthen existing reports."
  },
  {
    question: "What happens when a profile is reported?",
    answer: "Reported profiles undergo AI analysis and community verification. If confirmed as suspicious, they're added to our database with a risk score. We also compile reports for LinkedIn's trust & safety team to help get malicious accounts removed from the platform."
  },
  {
    question: "Is my search history private?",
    answer: "Yes. We don't share individual search histories with anyone. Aggregate data (like 'most searched profiles') is anonymized. Registered users can view and delete their own search history at any time."
  }
];

const FAQSection = () => {
  return (
    <section className="px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <HelpCircle size={24} className="text-primary" />
          <h3 className="font-serif text-2xl text-foreground">Frequently Asked Questions</h3>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-3xl border border-secondary/20 px-6 overflow-hidden hover:border-primary/40 transition-all duration-300 data-[state=open]:glow-pink-hover data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
