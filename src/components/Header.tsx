import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-center max-w-7xl left-1/2 -translate-x-1/2 z-20">
      <h1 className="text-xl md:text-2xl font-serif italic text-primary tracking-tight">
        The Bad Guys.
      </h1>
      <nav className="flex items-center gap-4">
        <button className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium hidden sm:block">
          Our Mission
        </button>
        <Button 
          variant="outline" 
          className="border-secondary/30 text-foreground hover:bg-card hover:text-primary rounded-full px-5"
        >
          Login
        </Button>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
        >
          Sign Up
        </Button>
      </nav>
    </header>
  );
};

export default Header;
