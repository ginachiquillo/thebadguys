import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

const Header = () => {
  const { user, isAdmin, signOut, quotaRemaining } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-center max-w-7xl left-1/2 -translate-x-1/2 z-20">
      <Link to="/">
        <h1 className="text-xl md:text-2xl font-serif italic text-primary tracking-tight neon-text">
          The Bad Guys.
        </h1>
      </Link>
      <nav className="flex items-center gap-4">
        <button className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium hidden sm:block">
          Our Mission
        </button>
        
        {user ? (
          <>
            {/* Quota indicator */}
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-card/50 px-3 py-1.5 rounded-full border border-border/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {quotaRemaining} search{quotaRemaining !== 1 ? 'es' : ''} left
            </span>
            
            {/* Admin link */}
            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  className="border-secondary/30 text-foreground hover:bg-card hover:text-primary rounded-full px-4 gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            
            {/* User menu */}
            <div className="flex items-center gap-2">
              <span className="hidden md:flex items-center gap-2 text-sm text-foreground/80">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-secondary/30 text-foreground hover:bg-card hover:text-destructive rounded-full px-4 gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button 
                variant="outline" 
                className="border-secondary/30 text-foreground hover:bg-card hover:text-primary rounded-full px-5"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 hover:glow-pink-strong transition-all duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
