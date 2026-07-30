import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/insights')({
  component: InsightsRoute,
});

function InsightsRoute() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogs', { status: 'published', category }],
    queryFn: async () => {
      const res = await api.get('/blogs', { params: { status: 'published', category } });
      return res.data;
    },
  });

  const featuredPost = posts?.find((p: any) => p.featured) || posts?.[0];
  const regularPosts = posts?.filter((p: any) => p._id !== featuredPost?._id) || [];

  const filteredPosts = regularPosts.filter((p: any) => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 md:text-center md:mx-auto md:max-w-2xl"
      >
        <p className="text-eyebrow mb-4">Editorial & Research</p>
        <h1 className="font-display text-5xl font-light tracking-tight sm:text-6xl md:text-7xl">Insights</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          Writing and research on the future of occupational medicine, healthcare systems, and professional legacy.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-between items-center border-b border-rule/60 pb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search articles or tags..." 
            className="w-full bg-background border border-rule/60 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {['', 'Healthcare', 'Research', 'Leadership', 'Medicine'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${category === cat ? 'bg-foreground text-background font-medium' : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80'}`}
            >
              {cat || 'All Topics'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading insights...</div>
      ) : (
        <>
          {featuredPost && !search && !category && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-24"
            >
              <Link to="/insights/$slug" params={{ slug: featuredPost.slug }} className="group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-center">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-foreground/5 shadow-md border border-rule/20">
                  {featuredPost.coverImage ? (
                    <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-display text-2xl bg-foreground/5">Featured Insight</div>
                  )}
                </div>
                <div className="md:pr-8">
                  <div className="flex items-center gap-3 text-xs text-gold mb-6 font-medium uppercase tracking-widest">
                    <span>{featuredPost.category || 'Article'}</span>
                    <span className="text-muted-foreground">&bull;</span>
                    <span className="text-muted-foreground">{format(new Date(featuredPost.publishDate || featuredPost.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl leading-tight group-hover:text-foreground/70 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-6 text-muted-foreground text-lg leading-relaxed line-clamp-3 italic font-light">
                    {featuredPost.excerpt || featuredPost.content.replace(/<[^>]+>/g, '')}
                  </p>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-foreground/10 overflow-hidden border border-rule/30">
                       <img src="/assets/portrait.jpg" alt="Dr. Supreet Khare" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-widest text-foreground">Dr. Supreet Khare</p>
                      <p className="text-xs text-muted-foreground mt-1">{featuredPost.readTimeMinutes} min read</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
          >
            {filteredPosts.map((post: any) => (
              <motion.div key={post._id} variants={item}>
                <Link to="/insights/$slug" params={{ slug: post.slug }} className="group flex flex-col h-full">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-foreground/5 shrink-0 border border-rule/20 shadow-sm">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gold mb-4 font-medium uppercase tracking-widest">
                    <span>{post.category || 'Article'}</span>
                    <span className="text-muted-foreground">&bull;</span>
                    <span className="text-muted-foreground">{post.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-display text-2xl leading-snug group-hover:text-foreground/70 transition-colors mb-3">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 mt-auto font-light">
                    {post.excerpt || post.content.replace(/<[^>]+>/g, '')}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          {filteredPosts.length === 0 && (
             <div className="text-center py-20 text-muted-foreground">No articles found matching your criteria.</div>
          )}
        </>
      )}
    </div>
  );
}
