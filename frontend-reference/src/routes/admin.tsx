import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Overview from '../components/admin/Overview';
import BlogCMS from '../components/admin/BlogCMS';
import JourneyEditor from '../components/admin/JourneyEditor';
import PortfolioManager from '../components/admin/PortfolioManager';
import ReviewModerator from '../components/admin/ReviewModerator';
import ContentManager from '../components/admin/ContentManager';
import NewsletterManager from '../components/admin/NewsletterManager';
import MediaManager from '../components/admin/MediaManager';
import SiteSettingsManager from '../components/admin/SiteSettingsManager';
import AboutManager from '../components/admin/AboutManager';
import AiPageManager from '../components/admin/AiPageManager';
import PageBuilder from '../components/admin/PageBuilder';
import UserManager from '../components/admin/UserManager';
import ContactManager from '../components/admin/ContactManager';
import api from '../lib/api';

export const Route = createFileRoute('/admin')({
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  const { user, loading, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (loading) return <div className="p-20 text-center">Loading admin session...</div>;

  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await login({ email, password });
        setLoginError('');
      } catch (err: any) {
        setLoginError('Invalid credentials');
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-foreground/5 p-8 rounded-3xl border border-rule/20">
          <h1 className="text-3xl font-display mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-rule/30 focus:border-gold outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-rule/30 focus:border-gold outline-none"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-gold text-foreground py-2 rounded-lg font-medium hover:scale-[1.02] transition-transform">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Admin Users' },
    { id: 'builder', label: 'Page Builder' },
    { id: 'content', label: 'Hero Section' },
    { id: 'about', label: 'About Page' },
    { id: 'ai', label: 'AI Page' },
    { id: 'blogs', label: 'Insights & Blogs' },
    { id: 'journey', label: 'Journey Milestones' },
    { id: 'publications', label: 'Publications' },
    { id: 'reviews', label: 'Review Moderation' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'contact', label: 'Inbox' },
    { id: 'media', label: 'Media Library' },
    { id: 'settings', label: 'Site Settings' }
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-rule/60 bg-foreground/5 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="font-display text-xl font-medium">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Logged in as {user.username}</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.id ? 'bg-foreground text-background font-medium' : 'text-foreground/80 hover:bg-foreground/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-rule/60">
          <button
            onClick={() => { logout(); navigate({ to: '/' }); }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'builder' && <PageBuilder />}
        {activeTab === 'about' && <AboutManager />}
        {activeTab === 'ai' && <AiPageManager />}
        {activeTab === 'blogs' && <BlogCMS />}
        {activeTab === 'journey' && <JourneyEditor />}
        { activeTab === 'publications' && <PortfolioManager /> }
        { activeTab === 'reviews' && <ReviewModerator /> }
        { activeTab === 'newsletter' && <NewsletterManager /> }
        { activeTab === 'contact' && <ContactManager /> }
        { activeTab === 'media' && <MediaManager /> }
        { activeTab === 'content' && <ContentManager /> }
        { activeTab === 'settings' && <SiteSettingsManager /> }
      </main>
    </div>
  );
}
