import ProfileCard from './ProfileCard';
import { Clock, TrendingUp } from 'lucide-react';

// Mock data - would come from database
const latestProfiles = [
  { id: 1, name: 'John CryptoRecruiter', title: 'Senior Talent Acquisition at Web3 Solutions', riskScore: 87, isActive: true },
  { id: 2, name: 'Sarah TechHunter', title: 'HR Director at GlobalTech Inc', riskScore: 92, isActive: true },
  { id: 3, name: 'Michael Blockchain', title: 'CEO & Founder at DeFi Ventures', riskScore: 78, isActive: false },
  { id: 4, name: 'Emily CareerCoach', title: 'Executive Recruiter at Fortune 500', riskScore: 65, isActive: true },
  { id: 5, name: 'David RemoteJobs', title: 'Talent Scout at Remote First Co', riskScore: 89, isActive: true },
];

const trendingProfiles = [
  { id: 1, name: 'Alex NFTRecruiter', title: 'Head of Talent at Metaverse Labs', riskScore: 95, searchCount: 1247 },
  { id: 2, name: 'Jessica StartupHR', title: 'People Operations at Stealth Startup', riskScore: 88, searchCount: 892 },
  { id: 3, name: 'Ryan CryptoTalent', title: 'Technical Recruiter at Blockchain Co', riskScore: 91, searchCount: 756 },
  { id: 4, name: 'Amanda Investment', title: 'Senior Partner at Venture Capital', riskScore: 72, searchCount: 543 },
  { id: 5, name: 'Chris RemoteWork', title: 'Hiring Manager at DistributedTeam', riskScore: 84, searchCount: 421 },
];

const ProfileLists = () => {
  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Reported */}
          <div className="bg-card/50 rounded-3xl border border-secondary/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-primary" />
              <h3 className="font-serif text-xl text-foreground">Latest Reported</h3>
            </div>
            <div className="space-y-4">
              {latestProfiles.map((profile) => (
                <ProfileCard 
                  key={profile.id}
                  name={profile.name}
                  title={profile.title}
                  riskScore={profile.riskScore}
                  isActive={profile.isActive}
                />
              ))}
            </div>
          </div>

          {/* Trending / Most Searched */}
          <div className="bg-card/50 rounded-3xl border border-secondary/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="font-serif text-xl text-foreground">Most Searched</h3>
            </div>
            <div className="space-y-4">
              {trendingProfiles.map((profile) => (
                <ProfileCard 
                  key={profile.id}
                  name={profile.name}
                  title={profile.title}
                  riskScore={profile.riskScore}
                  searchCount={profile.searchCount}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLists;
