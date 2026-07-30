import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/publications')({
  component: PublicationsRoute,
});

function PublicationsRoute() {
  const { data: publications, isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const res = await api.get('/publications');
      return res.data;
    },
  });

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
    <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center"
      >
        <p className="text-eyebrow mb-4">Academic & Clinical</p>
        <h1 className="font-display text-5xl font-light tracking-tight sm:text-6xl md:text-7xl">
          Publications
        </h1>
        <p className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A collection of peer-reviewed articles, books, and public health research contributing to the advancement of occupational medicine.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground animate-pulse">Retrieving publications...</div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {publications?.map((pub: any) => (
            <motion.div 
              key={pub._id} 
              variants={item}
              className="group relative rounded-3xl border border-rule/30 bg-background/50 p-8 md:p-10 transition-all duration-500 hover:border-gold/50 hover:bg-foreground/[0.02] shadow-sm hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-rule/30 pb-4">
                <span className="text-xs font-medium uppercase tracking-widest text-gold">
                  {pub.type || 'Journal Article'}
                </span>
                <span className="text-sm text-foreground/70 font-display">{pub.year}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl leading-snug text-foreground mb-4 group-hover:text-foreground/80 transition-colors">
                {pub.title}
              </h3>
              <p className="text-foreground/90 font-medium mb-4 italic">{pub.journal}</p>
              {pub.authors && (
                <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest">
                  {pub.authors.join(', ')}
                </p>
              )}
              {pub.abstract && (
                <p className="text-base text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                  {pub.abstract}
                </p>
              )}
              {pub.externalLink && (
                <a
                  href={pub.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium uppercase tracking-widest transition-colors hover:text-gold text-foreground"
                >
                  Read publication <span className="ml-2 font-display text-lg" aria-hidden>&rarr;</span>
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
