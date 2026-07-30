import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Server, Mail, BrainCircuit, Database, CheckCircle, XCircle, HardDrive } from 'lucide-react';
import { format } from 'date-fns';

const Overview = () => {
  const [data, setData] = useState<any>(null);
  const [reviewAnalytics, setReviewAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reviewUrl = `${window.location.origin}/share-review`;

  useEffect(() => {
    Promise.all([
      api.get('/health/dashboard'),
      api.get('/reviews/analytics')
    ]).then(([healthRes, analyticsRes]) => {
      setData(healthRes.data);
      setReviewAnalytics(analyticsRes.data);
      setLoading(false);
    })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading launch dashboard...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load launch dashboard.</div>;

  const getStatusIcon = (status: string) => {
    return status === 'connected' || status === 'configured' 
      ? <CheckCircle className="w-5 h-5 text-green-500" />
      : <XCircle className="w-5 h-5 text-red-500" />;
  };

  const isReady = data.health.database === 'connected' && data.health.smtp === 'configured';

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display text-ink">Launch Readiness Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">System health, integrations, and content verification.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${isReady ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'}`}>
          <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
          {isReady ? 'Systems Go' : 'Pending Configuration'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-foreground/5 p-6 rounded-2xl border border-rule/30 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Database (MongoDB)</h3>
            </div>
            <p className="text-2xl font-display capitalize">{data.health.database}</p>
          </div>
          {getStatusIcon(data.health.database)}
        </div>
        
        <div className="bg-foreground/5 p-6 rounded-2xl border border-rule/30 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">SMTP / Email Service</h3>
            </div>
            <p className="text-2xl font-display capitalize">{data.health.smtp}</p>
          </div>
          {getStatusIcon(data.health.smtp)}
        </div>

        <div className="bg-foreground/5 p-6 rounded-2xl border border-rule/30 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">AI Provider</h3>
            </div>
            <p className="text-2xl font-display capitalize">{data.health.ai}</p>
          </div>
          {getStatusIcon(data.health.ai)}
        </div>

        <div className="bg-foreground/5 p-6 rounded-2xl border border-rule/30 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Upload Storage</h3>
            </div>
            <p className="text-2xl font-display capitalize">{data.health.storage}</p>
          </div>
          {getStatusIcon(data.health.storage === 'writable' ? 'connected' : 'disconnected')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background rounded-2xl border border-rule/30 p-6">
          <h2 className="text-lg font-medium mb-6">Content Verification</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Journey Milestones</span>
              <span className="font-display text-xl">{data.counts.milestones}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Publications</span>
              <span className="font-display text-xl">{data.counts.publications}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Insights & Blogs</span>
              <span className="font-display text-xl">{data.counts.blogs}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Form Submissions</span>
              <span className="font-display text-xl">{data.counts.contacts || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Newsletter Subscribers</span>
              <span className="font-display text-xl">{data.counts.subscribers}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Media Assets</span>
              <span className="font-display text-xl">{data.counts.media}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground">Total Reviews</span>
              <span className="font-display text-xl">{reviewAnalytics?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-rule/10">
              <span className="text-muted-foreground pl-4 text-sm">- Average Rating</span>
              <span className="font-display text-lg">{reviewAnalytics?.averageRating?.toFixed(1) || '0.0'} / 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-rule/30 p-6">
          <h2 className="text-lg font-medium mb-6">Environment Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Backend Version</span>
              </div>
              <span className="text-sm font-mono bg-foreground/5 px-2 py-1 rounded">{data.versions.backend}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Frontend Version</span>
              </div>
              <span className="text-sm font-mono bg-foreground/5 px-2 py-1 rounded">{data.versions.frontend}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Node Environment</span>
              </div>
              <span className="text-sm font-mono bg-foreground/5 px-2 py-1 rounded">{data.versions.node}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">System Uptime</span>
              </div>
              <span className="text-sm font-mono bg-foreground/5 px-2 py-1 rounded">{(data.health.uptime / 3600).toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Storage Used</span>
              </div>
              <span className="text-sm font-mono bg-foreground/5 px-2 py-1 rounded">{(data.health.storageUsed / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between items-center py-2 mt-8 border-t border-rule/30 pt-6">
              <span className="text-sm text-muted-foreground">Last Admin Login</span>
              <span className="text-sm">{format(new Date(data.lastAdminLogin), 'PP pp')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
