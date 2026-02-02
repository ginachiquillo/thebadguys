import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, Trash2, ExternalLink, Plus, LogOut, ArrowLeft } from 'lucide-react';

type ProfileStatus = 'pending' | 'verified' | 'rejected';

interface Profile {
  id: string;
  linkedin_url: string;
  name: string;
  title: string | null;
  avatar_url: string | null;
  risk_score: number;
  status: ProfileStatus;
  is_active_on_linkedin: boolean;
  report_count: number;
  ai_analysis: string | null;
  last_checked_at: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data as Profile[]) || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profiles',
        variant: 'destructive',
      });
    } finally {
      setLoadingProfiles(false);
    }
  };

  const updateProfileStatus = async (id: string, status: ProfileStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev =>
        prev.map(p => (p.id === id ? { ...p, status } : p))
      );

      toast({
        title: 'Status Updated',
        description: `Profile marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile status',
        variant: 'destructive',
      });
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.filter(p => p.id !== id));

      toast({
        title: 'Profile Deleted',
        description: 'The profile has been removed',
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete profile',
        variant: 'destructive',
      });
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">{score}/100</Badge>;
    if (score >= 50) return <Badge className="bg-primary text-primary-foreground">{score}/100</Badge>;
    return <Badge variant="secondary">{score}/100</Badge>;
  };

  const getStatusBadge = (status: ProfileStatus) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-destructive text-destructive-foreground">Verified Fake</Badge>;
      case 'pending':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="outline">Not Fake</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Site</span>
            </Link>
            <h1 className="font-serif text-2xl text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="glow-pink">
              <Link to="/admin/find-profiles">
                <Search className="mr-2 h-4 w-4" />
                Find New Profiles
              </Link>
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card/50 rounded-3xl border border-secondary/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-foreground">All Profiles</h2>
            <span className="text-sm text-muted-foreground">
              {profiles.length} profile{profiles.length !== 1 ? 's' : ''} total
            </span>
          </div>

          {loadingProfiles ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No profiles found</p>
              <Button asChild>
                <Link to="/admin/find-profiles">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Profile
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map(profile => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {profile.title || '-'}
                      </TableCell>
                      <TableCell>{getRiskBadge(profile.risk_score)}</TableCell>
                      <TableCell>{getStatusBadge(profile.status)}</TableCell>
                      <TableCell>{profile.report_count}</TableCell>
                      <TableCell>
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View <ExternalLink size={14} />
                        </a>
                        {!profile.is_active_on_linkedin && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Deactivated
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {profile.status !== 'verified' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateProfileStatus(profile.id, 'verified')}
                              title="Verify as Fake"
                            >
                              <CheckCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                          {profile.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateProfileStatus(profile.id, 'rejected')}
                              title="Mark as Not Fake"
                            >
                              <XCircle className="h-4 w-4 text-secondary" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" title="Delete">
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove "{profile.name}" from the database. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProfile(profile.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
