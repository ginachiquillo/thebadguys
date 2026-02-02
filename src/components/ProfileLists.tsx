import { useEffect, useState } from 'react';
import ProfileCard from './ProfileCard';
import { Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  title: string | null;
  risk_score: number;
  is_active_on_linkedin: boolean;
  report_count: number;
  created_at: string;
}

const ProfileLists = () => {
  const [latestProfiles, setLatestProfiles] = useState<Profile[]>([]);
  const [trendingProfiles, setTrendingProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Fetch latest verified profiles (public can see verified only)
      const { data: latest, error: latestError } = await supabase
        .from('profiles')
        .select('id, name, title, risk_score, is_active_on_linkedin, report_count, created_at')
        .eq('status', 'verified')
        .order('created_at', { ascending: false })
        .limit(5);

      if (latestError) throw latestError;
      setLatestProfiles((latest as Profile[]) || []);

      // Fetch most reported (trending) verified profiles
      const { data: trending, error: trendingError } = await supabase
        .from('profiles')
        .select('id, name, title, risk_score, is_active_on_linkedin, report_count, created_at')
        .eq('status', 'verified')
        .order('report_count', { ascending: false })
        .limit(5);

      if (trendingError) throw trendingError;
      setTrendingProfiles((trending as Profile[]) || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Show placeholder if no profiles yet
  if (latestProfiles.length === 0 && trendingProfiles.length === 0) {
    return (
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-serif text-xl mb-2">No verified profiles yet</p>
            <p className="text-sm">Be the first to report a suspicious profile!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Reported */}
          <div className="bg-card/50 rounded-3xl border border-secondary/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-primary" />
              <h3 className="font-serif text-xl text-foreground">Latest Verified</h3>
            </div>
            <div className="space-y-4">
              {latestProfiles.length > 0 ? (
                latestProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id}
                    name={profile.name}
                    title={profile.title || 'Unknown'}
                    riskScore={profile.risk_score}
                    isActive={profile.is_active_on_linkedin}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No profiles yet</p>
              )}
            </div>
          </div>

          {/* Trending / Most Reported */}
          <div className="bg-card/50 rounded-3xl border border-secondary/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="font-serif text-xl text-foreground">Most Reported</h3>
            </div>
            <div className="space-y-4">
              {trendingProfiles.length > 0 ? (
                trendingProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id}
                    name={profile.name}
                    title={profile.title || 'Unknown'}
                    riskScore={profile.risk_score}
                    searchCount={profile.report_count}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No profiles yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLists;
