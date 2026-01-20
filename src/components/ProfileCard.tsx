import { User, TrendingUp } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  title: string;
  riskScore: number;
  searchCount?: number;
  isActive?: boolean;
}

const ProfileCard = ({ name, title, riskScore, searchCount, isActive = true }: ProfileCardProps) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 50) return 'text-primary';
    return 'text-secondary';
  };

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-destructive/20';
    if (score >= 50) return 'bg-primary/20';
    return 'bg-secondary/20';
  };

  return (
    <div className="bg-card rounded-3xl border border-secondary/20 p-5 hover:border-primary/60 transition-all duration-300 glow-pink hover:glow-pink-hover group cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <User size={24} className="text-secondary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-foreground font-medium truncate">{name}</h4>
            {!isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                Deactivated
              </span>
            )}
          </div>
          <p className="text-sm text-muted truncate mb-3">{title}</p>
          
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${getRiskBg(riskScore)}`}>
              <span className={`text-sm font-semibold ${getRiskColor(riskScore)}`}>
                {riskScore}/100
              </span>
            </div>
            
            {searchCount !== undefined && (
              <div className="flex items-center gap-1 text-muted text-xs">
                <TrendingUp size={12} />
                <span>{searchCount.toLocaleString()}x searched</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
