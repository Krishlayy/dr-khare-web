import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { format } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/ui/hover-card';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/journey')({
  component: JourneyRoute,
});

function JourneyRoute() {
  const { data: milestones, isLoading } = useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      const res = await api.get('/milestones');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-10 text-center text-muted-foreground animate-pulse">
        Curating archives...
      </div>
    );
  }

  const sortedMilestones = milestones?.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-24 md:px-10 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 text-center"
      >
        <p className="text-eyebrow mb-4">The Archive</p>
        <h1 className="font-display text-5xl font-light tracking-tight sm:text-6xl md:text-7xl">
          Career Journey
        </h1>
        <p className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A narrative timeline of education, clinical leadership, and professional milestones. 
          Not merely a résumé, but the chapters of a lifelong commitment to systemic healthcare.
        </p>
      </motion.div>

      <div className="relative border-l border-rule/30 pl-8 md:pl-12 ml-4 md:ml-0">
        {sortedMilestones.map((m: any, idx: number) => (
          <motion.div 
            key={m._id} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="mb-20 relative group"
          >
            {/* Timeline Dot */}
            <span className="absolute -left-[37px] md:-left-[53px] top-2 flex h-3 w-3 items-center justify-center rounded-full bg-gold shadow-[0_0_0_4px_var(--background)] transition-transform duration-500 group-hover:scale-150" />
            
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 items-baseline">
              {/* Date */}
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {format(new Date(m.startDate), 'yyyy')} &mdash; {m.endDate ? format(new Date(m.endDate), 'yyyy') : 'Present'}
              </div>
              
              {/* Content */}
              <div>
                <HoverCard openDelay={100} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <Link to="/journey/$slug" params={{ slug: m.slug || m._id }} className="inline-block">
                      <h3 className="font-display text-3xl md:text-4xl leading-tight hover:text-foreground/70 transition-colors">
                        {m.institution}
                      </h3>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-[380px] p-0 overflow-hidden rounded-xl border border-rule/40 shadow-2xl bg-background/95 backdrop-blur-xl" 
                    side="right"
                    align="start"
                    sideOffset={30}
                  >
                    <div className="flex flex-col">
                      {m.coverImage && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img src={m.coverImage} alt={m.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-xs uppercase tracking-widest text-gold mb-1">{m.title}</p>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <p className="text-sm text-foreground/90 italic leading-relaxed mb-4 line-clamp-3">
                          "{m.description}"
                        </p>
                        
                        {m.achievements && m.achievements.length > 0 && (
                          <div className="mb-4 pt-4 border-t border-rule/30">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Key Highlight</p>
                            <p className="text-sm font-medium">{m.achievements[0]}</p>
                          </div>
                        )}
                        
                        <div className="pt-2">
                           <Link to="/journey/$slug" params={{ slug: m.slug || m._id }} className="text-xs font-medium uppercase tracking-wider text-gold hover:text-gold/80 transition-colors flex items-center gap-1">
                              Read Full Story <span aria-hidden>&rarr;</span>
                           </Link>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <p className="text-xl text-foreground/80 mt-2 mb-4">
                  {m.title}
                </p>
                <div className="md:hidden">
                    <p className="text-sm text-muted-foreground mb-4 italic">
                      "{m.description}"
                    </p>
                    <Link to="/journey/$slug" params={{ slug: m.slug || m._id }} className="text-sm font-medium hover:underline text-foreground">
                      Read full story &rarr;
                    </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Endcap */}
      <div className="mt-24 text-center">
        <span className="inline-block h-2 w-2 rounded-full bg-rule/50" />
      </div>
    </div>
  );
}
