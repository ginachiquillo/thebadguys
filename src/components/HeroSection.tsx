import { useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * Validates that a URL is a valid LinkedIn profile or company URL.
 * Prevents SSRF and injection attacks by enforcing strict domain allowlist.
 */
const validateLinkedInUrl = (url: string): { valid: boolean; error?: string } => {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { valid: false, error: 'Please enter a LinkedIn URL' };
  }

  try {
    const parsed = new URL(trimmedUrl);
    
    // Strict hostname validation - only allow linkedin.com domains
    const isLinkedInDomain = 
      parsed.hostname === 'linkedin.com' || 
      parsed.hostname === 'www.linkedin.com' ||
      parsed.hostname.endsWith('.linkedin.com');
    
    if (!isLinkedInDomain) {
      return { valid: false, error: 'Please enter a valid LinkedIn URL' };
    }

    // Validate path format for profiles or companies
    const validPaths = ['/in/', '/company/', '/pub/'];
    const hasValidPath = validPaths.some(path => parsed.pathname.startsWith(path));
    
    if (!hasValidPath) {
      return { valid: false, error: 'Please enter a LinkedIn profile or company URL' };
    }

    // Ensure HTTPS protocol
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'Please use a secure LinkedIn URL (https)' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }
};

const HeroSection = () => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleCheck = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    const validation = validateLinkedInUrl(trimmedUrl);
    
    if (!validation.valid) {
      toast({
        title: 'Invalid URL',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    // TODO: Implement profile check with validated URL
    // The URL is now validated and safe to pass to backend
    toast({
      title: 'Profile Check',
      description: 'Validating profile... (feature coming soon)',
    });
    setIsValidating(false);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Soft Pink Glow Overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] -ml-24 -mb-24" />
      
      <main className="z-10 w-full max-w-3xl text-center">
        {/* Mom-like Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-secondary/20 text-secondary text-xs mb-8">
          <Heart size={14} className="fill-secondary text-secondary" />
          <span>Because you deserve a safe career journey, sweetheart.</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-6 leading-tight">
          Spot the <span className="text-primary neon-text">Bad Guys</span> <br /> 
          before you hit send.
        </h2>
        
        <p className="text-secondary text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Tired of suspicious messages? Paste a LinkedIn profile URL below and I'll tell you if they're worth your time.
        </p>

        {/* Search Bar Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-4xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
          
          <div className="relative flex items-center bg-card rounded-4xl border border-secondary/30 p-2 pl-6 glow-pink">
            <Search className="text-secondary mr-4 flex-shrink-0" size={20} />
            <input 
              type="text"
              placeholder="Paste LinkedIn Profile URL here..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-secondary/50 py-4 text-lg font-sans"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
            <Button 
              onClick={handleCheck}
              disabled={isValidating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-3xl transition-all transform hover:scale-[1.02] active:scale-95 whitespace-nowrap hover:glow-pink-neon disabled:opacity-50"
            >
              {isValidating ? 'Checking...' : 'Check Profile'}
            </Button>
          </div>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
