import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Key, Link2, Search, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { z } from 'zod';

// LinkedIn URL validation schema
const linkedInUrlSchema = z.string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && 
               parsed.hostname.includes('linkedin.com') &&
               (url.includes('/in/') || url.includes('/company/') || url.includes('/pub/'));
      } catch {
        return false;
      }
    },
    'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)'
  );

const FindProfiles = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [savingApiKey, setSavingApiKey] = useState(false);
  
  const [profileUrl, setProfileUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    title: string;
    riskScore: number;
    analysis: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      checkApiKey();
    }
  }, [isAdmin]);

  const checkApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'linkedin_api_key')
        .maybeSingle();

      if (error) throw error;
      setHasApiKey(!!data?.value);
    } catch (error) {
      console.error('Error checking API key:', error);
      setHasApiKey(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setSavingApiKey(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert(
          { key: 'linkedin_api_key', value: apiKey.trim() },
          { onConflict: 'key' }
        );

      if (error) throw error;

      setHasApiKey(true);
      setApiKey('');
      toast({
        title: 'API Key Saved',
        description: 'LinkedIn API key has been configured successfully',
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      });
    } finally {
      setSavingApiKey(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    const result = linkedInUrlSchema.safeParse(url);
    if (!result.success) {
      setUrlError(result.error.errors[0].message);
      return false;
    }
    setUrlError('');
    return true;
  };

  const analyzeProfile = async (url: string) => {
    if (!validateUrl(url)) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await supabase.functions.invoke('analyze-profile', {
        body: { linkedinUrl: url },
      });

      if (response.error) {
        if (response.error.message?.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.error.message?.includes('402')) {
          throw new Error('AI credits exhausted. Please add funds to continue.');
        }
        throw response.error;
      }

      const data = response.data;
      setAnalysisResult({
        name: data.name,
        title: data.title,
        riskScore: data.riskScore,
        analysis: data.analysis,
      });

      toast({
        title: 'Analysis Complete',
        description: `Risk score: ${data.riskScore}/100`,
      });
    } catch (error: any) {
      console.error('Error analyzing profile:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze profile',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveProfile = async () => {
    if (!analysisResult || !profileUrl) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          linkedin_url: profileUrl,
          name: analysisResult.name,
          title: analysisResult.title,
          risk_score: analysisResult.riskScore,
          ai_analysis: analysisResult.analysis,
          status: 'pending',
          reported_by: user?.id,
          last_checked_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Exists',
            description: 'This profile has already been reported',
            variant: 'destructive',
          });
          return;
        }
        throw error;
      }

      toast({
        title: 'Profile Saved',
        description: 'Profile added for review',
      });

      setProfileUrl('');
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    }
  };

  const searchProfiles = async () => {
    if (!searchKeywords.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter search keywords',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Search Started',
      description: 'Searching for profiles matching your keywords...',
    });

    // TODO: Implement keyword search via LinkedIn API when available
    setTimeout(() => {
      toast({
        title: 'Coming Soon',
        description: 'Keyword search will be available once LinkedIn API integration is complete',
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show API key setup if not configured
  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-6 py-12">
          <Card className="bg-card/50 border-secondary/10">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Configure LinkedIn API</CardTitle>
              <CardDescription>
                To search for profiles, you need to configure your LinkedIn API credentials first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">LinkedIn API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button 
                onClick={saveApiKey} 
                disabled={savingApiKey}
                className="w-full glow-pink"
              >
                {savingApiKey ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your API key is stored securely and only accessible to admins.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-serif text-2xl text-foreground">Find Profiles</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHasApiKey(false)}
          >
            <Key className="mr-2 h-4 w-4" />
            Update API Key
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="url" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Profile URL
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Keyword Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <Card className="bg-card/50 border-secondary/10">
              <CardHeader>
                <CardTitle className="font-serif">Analyze by URL</CardTitle>
                <CardDescription>
                  Paste a LinkedIn profile URL to analyze it for suspicious patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profileUrl">LinkedIn Profile URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profileUrl"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={profileUrl}
                      onChange={(e) => {
                        setProfileUrl(e.target.value);
                        if (urlError) setUrlError('');
                      }}
                      className={`bg-background flex-1 ${urlError ? 'border-destructive' : ''}`}
                    />
                    <Button
                      onClick={() => analyzeProfile(profileUrl)}
                      disabled={isAnalyzing || !profileUrl.trim()}
                      className="glow-pink"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  {urlError && (
                    <p className="text-sm text-destructive">{urlError}</p>
                  )}
                </div>

                {analysisResult && (
                  <div className="mt-6 p-4 rounded-2xl border border-secondary/20 bg-background/50 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-foreground">{analysisResult.name}</h3>
                        <p className="text-sm text-muted-foreground">{analysisResult.title}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        analysisResult.riskScore >= 80 
                          ? 'bg-destructive/20 text-destructive' 
                          : analysisResult.riskScore >= 50 
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {analysisResult.riskScore}/100 Risk
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        {analysisResult.riskScore >= 50 ? (
                          <AlertTriangle className="h-4 w-4 text-primary" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-secondary" />
                        )}
                        AI Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {analysisResult.analysis}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={saveProfile} className="flex-1 glow-pink">
                        Save for Review
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAnalysisResult(null);
                          setProfileUrl('');
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card className="bg-card/50 border-secondary/10">
              <CardHeader>
                <CardTitle className="font-serif">Search by Keywords</CardTitle>
                <CardDescription>
                  Search LinkedIn for profiles matching specific keywords (name, company, title).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Search Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      type="text"
                      placeholder="e.g., crypto recruiter, web3 talent"
                      value={searchKeywords}
                      onChange={(e) => setSearchKeywords(e.target.value)}
                      className="bg-background flex-1"
                    />
                    <Button
                      onClick={searchProfiles}
                      disabled={!searchKeywords.trim()}
                      className="glow-pink"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Search results will appear here. You can then analyze individual profiles.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FindProfiles;
