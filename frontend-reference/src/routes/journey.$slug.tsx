import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/journey/$slug')({
  component: JourneyDetailRoute,
});

function JourneyDetailRoute() {
  const { slug } = Route.useParams();

  const { data: milestone, isLoading } = useQuery({
    queryKey: ['milestone', slug],
    queryFn: async () => {
      const res = await api.get(`/milestones/${slug}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse text-muted-foreground">Retrieving archive...</div>;
  if (!milestone) return <div className="p-20 text-center">Story not found.</div>;

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-foreground">
        {milestone.coverImage && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={milestone.coverImage} 
            alt={milestone.title} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/journey" className="text-sm font-medium uppercase tracking-widest text-gold hover:text-gold/80 transition-colors mb-6 inline-block">
              &larr; Back to Timeline
            </Link>
            <p className="text-foreground/80 font-medium uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-gold inline-block"></span>
              {format(new Date(milestone.startDate), 'yyyy')} &mdash; {milestone.endDate ? format(new Date(milestone.endDate), 'yyyy') : 'Present'}
            </p>
            <h1 className="font-display text-5xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground">
              {milestone.institution}
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-light text-foreground/80 max-w-2xl">
              {milestone.title} {milestone.location && `— ${milestone.location}`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">
          
          {/* Main Narrative */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="prose prose-neutral dark:prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-light"
          >
            {milestone.narrative ? (
              <div dangerouslySetInnerHTML={{ __html: milestone.narrative }} />
            ) : (
              <p className="text-xl leading-relaxed text-muted-foreground italic font-light">"{milestone.description}"</p>
            )}

            {milestone.gallery?.length > 0 && (
              <div className="mt-20 not-prose">
                <h3 className="font-display text-3xl mb-8 border-b border-rule/30 pb-4">Gallery Archive</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {milestone.gallery.map((img: string, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl overflow-hidden aspect-[4/3] bg-foreground/5 shadow-sm border border-rule/20"
                    >
                      <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-16"
          >
            {/* Quick Summary Card */}
            <div className="rounded-2xl bg-foreground/5 p-8 border border-rule/30 backdrop-blur-sm">
               <h3 className="font-display text-xl mb-4">Snapshot</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
            </div>

            {/* Achievements */}
            {milestone.achievements?.length > 0 && (
              <div>
                <h3 className="font-display text-2xl mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-gold block"></span>
                  Key Achievements
                </h3>
                <ul className="space-y-5">
                  {milestone.achievements.map((ach: string, i: number) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-gold font-display text-xl mt-[-2px]">{i + 1}.</span>
                      <span className="text-base text-foreground/90 leading-snug">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Memories */}
            {milestone.memories?.length > 0 && (
              <div className="rounded-2xl bg-gold/5 p-8 border border-gold/20 backdrop-blur-sm">
                <h3 className="font-display text-2xl mb-6 text-gold">Memories & Reflections</h3>
                <ul className="space-y-6">
                  {milestone.memories.map((memory: string, i: number) => (
                    <li key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-gold before:rounded-full">
                      <p className="text-base text-foreground/90 leading-relaxed italic">"{memory}"</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Publications */}
            {milestone.relatedPublications?.length > 0 && (
              <div>
                <h3 className="font-display text-2xl mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-gold block"></span>
                  Associated Work
                </h3>
                <ul className="space-y-6">
                  {milestone.relatedPublications.map((pub: any) => (
                    <li key={pub._id} className="group">
                      <a href={pub.link || "#"} target="_blank" rel="noreferrer" className="block">
                        <span className="font-medium text-foreground group-hover:text-gold transition-colors block leading-tight">{pub.title}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2 block">{pub.journal} &bull; {pub.year}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </article>
  );
}
