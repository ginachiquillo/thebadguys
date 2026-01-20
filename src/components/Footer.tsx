import { Heart, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="px-4 py-12 border-t border-secondary/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted text-sm">
            <span>© 2025</span>
            <span className="font-serif italic text-primary">The Bad Guys</span>
            <span>— Protecting careers with</span>
            <Heart size={14} className="text-primary fill-primary" />
          </div>
          
          <div className="flex items-center gap-6 text-muted text-sm">
            <a href="mailto:contact@thebadguy.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={14} />
              <span>contact@thebadguy.com</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>France 🇫🇷</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
