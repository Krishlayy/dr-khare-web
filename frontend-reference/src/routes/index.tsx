import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import api from "../lib/api";
import portrait from "@/assets/sk-porsche.png";
import { ArrowRight, BookOpen, HeartPulse, Stethoscope, Microscope, BrainCircuit, Award, ShieldCheck, Building2, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});
function Home() {
  const { data: layout } = useQuery({
    queryKey: ['content', 'page_layout'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.page_layout?.sections || [];
    }
  });

  const defaultOrder = [
    { id: 'hero', component: <HeroSection key="hero" /> },
    { id: 'video', component: <FeaturedVideo key="video" /> },
    { id: 'research', component: <ResearchImpact key="research" /> },
    { id: 'publications', component: <FeaturedPublications key="publications" /> },
    { id: 'insights', component: <FeaturedInsights key="insights" /> },
    { id: 'awards', component: <AwardsSection key="awards" /> },
    { id: 'metrics', component: <ImpactMetrics key="metrics" /> },
    { id: 'journey', component: <FeaturedJourney key="journey" /> },
    { id: 'reviews', component: <PatientReviews key="reviews" /> },
    { id: 'ai', component: <AiCallout key="ai" /> },
  ];

  const sectionsToRender = layout?.length > 0 
    ? [...layout].sort((a, b) => a.order - b.order).filter(s => s.visible).map(s => defaultOrder.find(d => d.id === s.id)?.component)
    : defaultOrder.map(d => d.component);

  return (
    <div className="w-full text-foreground bg-background">
      {sectionsToRender}
    </div>
  );
}

// Removed hardcoded PILLARS array

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const { data } = useQuery({
    queryKey: ['content', 'homepage_content'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data;
    }
  });

  const homeData = data?.homepage_content || {};
  const pillars = data?.homepage_pillars || [];

  const getIcon = (name: string) => {
    switch(name) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Microscope': return <Microscope className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-rule/30 pb-20">
      <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gold/5 blur-[120px]" />
        {homeData?.hero_background && (
          <img src={homeData.hero_background} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-10 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gold inline-block"></span>
              AAMC ID 14088248
            </p>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-[6rem] leading-[1.05] tracking-tight font-light mb-8 whitespace-pre-line">
              {homeData?.hero_title || "Dr. Supreet Khare"}
            </h1>
            <p className="text-xl md:text-2xl font-light text-foreground/80 mb-10 max-w-2xl leading-relaxed whitespace-pre-line">
              {homeData?.hero_subtitle || "Physician, Healthcare Executive, and Researcher shaping the intersection of occupational medicine and systemic resilience."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={homeData?.cta_primary_url || "/about"} className="rounded-full bg-foreground text-background px-8 py-3.5 text-sm font-medium hover:bg-foreground/90 transition-all hover:scale-105">
                {homeData?.cta_primary_text || "Read Biography"}
              </Link>
              <Link to={homeData?.cta_secondary_url || "/contact"} className="rounded-full border border-rule/60 bg-background/50 backdrop-blur-sm px-8 py-3.5 text-sm font-medium hover:border-foreground/30 hover:bg-foreground/5 transition-all">
                {homeData?.cta_secondary_text || "Request Consultation"}
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-foreground/5 border border-rule/30 shadow-2xl relative">
              <img src={portrait} alt="Dr. Supreet Khare" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            
            {/* Floating Element */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 md:-left-12 bg-background/90 backdrop-blur-xl p-5 rounded-2xl border border-rule/40 shadow-xl max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs uppercase tracking-widest font-medium">Current Focus</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                Medical Director of Occupational Medicine at Lompoc Valley Medical Center.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Leadership Pillars */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 mt-24 z-10 relative">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8 text-center">
          Pillars of Practice
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map((pillar: any, i: number) => (
            <motion.div 
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
              className="p-6 rounded-2xl border border-rule/30 bg-background/40 hover:bg-foreground/[0.02] hover:border-gold/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-gold mb-4 group-hover:scale-110 group-hover:bg-gold group-hover:text-background transition-all">
                {getIcon(pillar.icon)}
              </div>
              <h3 className="font-display text-lg mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedVideo() {
  const { data: content } = useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data;
    },
  });

  const videoUrl = content?.featured_video_url;
  const videoTitle = content?.featured_video_title || "Meet Dr. Supreet Khare";

  if (!videoUrl) return null;

  return (
    <section className="py-24 border-b border-rule/30 bg-foreground/5 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 md:px-10 relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4 flex justify-center items-center gap-3">
            <span className="w-8 h-px bg-gold inline-block"></span>
            Introduction
            <span className="w-8 h-px bg-gold inline-block"></span>
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight">{videoTitle}</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-video w-full rounded-3xl overflow-hidden border border-rule/30 shadow-2xl bg-black relative group"
        >
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe 
              src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
              title={videoTitle} 
              className="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-cover"
              poster={portrait}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedInsights() {
  const { data: blogs } = useQuery({
    queryKey: ['blogs', { status: 'published' }],
    queryFn: async () => {
      const res = await api.get('/blogs', { params: { status: 'published' } });
      return res.data;
    },
  });

  const featured = blogs?.slice(0, 3) || [];

  if (!featured.length) return null;

  return (
    <section className="py-24 bg-foreground/5 border-b border-rule/30">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold inline-block"></span>
              Editorial
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight">
              Insights & Ideas
            </h2>
          </div>
          <Link to="/insights" className="text-sm font-medium uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-2">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((post: any, i: number) => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to="/insights/$slug" params={{ slug: post.slug }} className="group block h-full flex flex-col">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-background mb-6 border border-rule/20 shadow-sm relative">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
                </div>
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gold mb-3">
                  <span>{post.category || 'Article'}</span>
                  <span className="text-muted-foreground">&bull;</span>
                  <span className="text-muted-foreground">{post.readTimeMinutes} min read</span>
                </div>
                <h3 className="font-display text-2xl leading-snug group-hover:text-foreground/70 transition-colors mb-3">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mt-auto font-light">
                  {post.excerpt || post.content.replace(/<[^>]+>/g, '')}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPublications() {
  const { data: publications } = useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const res = await api.get('/publications');
      return res.data;
    },
  });

  const featured = publications?.slice(0, 3) || [];

  if (!featured.length) return null;

  return (
    <section className="py-24 border-b border-rule/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-16">
          
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold inline-block"></span>
              Academic
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-6">
              Selected <br/>Research
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Fourteen peer-reviewed publications across occupational health, systemic immunology, and hospital operations.
            </p>
            <Link to="/publications" className="inline-flex items-center justify-center rounded-full border border-rule/60 px-6 py-2.5 text-sm font-medium hover:bg-foreground hover:text-background transition-colors">
              Browse Full Library
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featured.map((pub: any, i: number) => (
              <motion.div 
                key={pub._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-2xl border border-rule/30 bg-background hover:border-gold/40 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {pub.year}
                  </span>
                </div>
                <h3 className="font-display text-xl mb-3 group-hover:text-foreground/80 transition-colors leading-snug">
                  {pub.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground italic mb-4">
                  {pub.journal}
                </p>
                {pub.externalLink && (
                  <a href={pub.externalLink} target="_blank" rel="noreferrer" className="text-xs font-medium uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-1">
                    Read Paper <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function CountUp({ to, duration = 2, suffix = '' }: { to: number, duration?: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, motionValue, to]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest).toString() + suffix);
    });
  }, [springValue, suffix]);

  return <span ref={ref}>{displayValue}</span>;
}

function ImpactMetrics() {
  const { data: content } = useQuery({
    queryKey: ['content', 'homepage_metrics'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.homepage_metrics || [];
    }
  });

  const metrics = content || [];

  return (
    <section className="py-24 bg-foreground text-background border-b border-foreground/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-background/10">
          {metrics.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-5xl md:text-6xl font-light mb-3">
                <CountUp to={m.value} suffix={m.suffix} />
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 max-w-[150px] mx-auto leading-relaxed">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PatientReviews() {
  const { data: analytics } = useQuery({
    queryKey: ['reviews-analytics'],
    queryFn: async () => {
      const res = await api.get('/reviews/analytics');
      return res.data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'featured'],
    queryFn: async () => {
      const res = await api.get('/reviews/public');
      return res.data.filter((r: any) => r.status === 'featured').slice(0, 1);
    },
  });

  if (!reviews) return null;

  return (
    <section className="py-24 border-b border-rule/30 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative z-10">
        
        <div className="flex flex-col md:flex-row gap-12 items-end justify-between mb-16 border-b border-rule/30 pb-12">
          <div className="max-w-xl">
             <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-3">
               <span className="w-8 h-px bg-gold inline-block"></span>
               Patient Experiences
             </p>
             <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-6">Trust & Care</h2>
             <p className="text-muted-foreground text-sm leading-relaxed">
               Honest feedback and verified testimonials from patients and professional colleagues across a decade of clinical practice.
             </p>
          </div>
          
          <div className="bg-foreground/5 p-6 rounded-2xl border border-rule/20 flex items-center gap-8 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-6 h-6 fill-gold text-gold" />
                <span className="font-display text-4xl">{analytics?.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-muted-foreground text-xl mt-1">/ 5</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-rule/30"></div>
            <div>
              <p className="font-display text-4xl mb-1">{analytics?.approved || 0}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Verified Reviews</p>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-rule/20 border-dashed">
            <h3 className="font-display text-2xl mb-4">No Experiences Shared Yet</h3>
            <p className="text-muted-foreground mb-8">Be the first to share your experience with Dr. Khare.</p>
            <Link to="/share-review" className="inline-flex items-center justify-center rounded-full bg-gold text-foreground px-8 py-3.5 text-sm font-medium hover:scale-105 transition-transform">
              Share Your Experience
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review: any, i: number) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-foreground/5 border border-rule/20 relative"
                >
                  <div className="text-gold text-4xl font-display absolute top-6 left-6 opacity-20">"</div>
                  <div className="flex gap-1 mb-6 mt-2 relative z-10">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 mb-8 relative z-10 italic">
                    "{review.reviewText}"
                  </p>
                  <div className="flex items-center justify-between border-t border-rule/30 pt-4 mt-auto">
                    <p className="text-sm font-medium">{review.publishPreference === 'publish_anonymously' ? 'Anonymous Patient' : review.patientName}</p>
                    {review.treatment && <p className="text-xs text-muted-foreground uppercase tracking-widest">{review.treatment}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 flex justify-center gap-4">
              <Link to="/reviews" className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-foreground hover:text-gold transition-colors gap-2 px-6 py-3 border border-rule/30 rounded-full">
                View All Reviews <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/share-review" className="inline-flex items-center text-sm font-medium uppercase tracking-widest bg-gold text-foreground hover:scale-105 transition-transform gap-2 px-6 py-3 rounded-full">
                Share Your Experience
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedJourney() {
  const { data: milestones } = useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      const res = await api.get('/milestones');
      return res.data.slice(0, 1); // Get latest milestone as featured
    },
  });

  const featured = milestones?.[0];

  if (!featured) return null;

  return (
    <section className="py-24 bg-foreground/5 border-b border-rule/30">
      <div className="mx-auto max-w-7xl px-6 md:px-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4">Featured Journey Chapter</p>
        <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-8">{featured.title}</h2>
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-muted-foreground leading-relaxed">{featured.description?.replace(/<[^>]+>/g, '').substring(0, 250)}...</p>
        </div>
        <Link to="/journey" className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-foreground hover:text-gold transition-colors gap-2 border border-rule/30 rounded-full px-8 py-3">
          Explore The Journey <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function AiCallout() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute -left-[20%] -bottom-[50%] w-[60%] h-[150%] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
      <div className="mx-auto max-w-5xl px-6 md:px-10 relative z-10">
        <div className="rounded-[2.5rem] bg-foreground text-background p-10 md:p-16 text-center border border-foreground/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8 border border-gold/30">
              <BrainCircuit className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-light mb-6">Explore the Archive with AI</h2>
            <p className="text-background/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-light">
              Interact directly with an intelligent agent trained exclusively on Dr. Khare's published research, career timeline, and administrative philosophy.
            </p>
            <Link to="/ask" className="inline-flex items-center justify-center rounded-full bg-gold text-foreground px-8 py-4 text-sm font-medium uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-gold/20">
              Launch Assistant
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResearchImpact() {
  const stats = [
    { label: "Peer-Reviewed Publications", value: "15+" },
    { label: "Original Research Projects", value: "10+" },
    { label: "Global Institutions", value: "6" },
    { label: "Consecutive ICMR Grants", value: "5" }
  ];

  return (
    <section className="py-24 bg-background border-b border-rule/30">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold inline-block"></span>
              Research Impact
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-6">
              Translating Data <br/>into Practice
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              From seminal work in pediatric lead exposure to global proteomics databases, Dr. Khare's research bridges the gap between laboratory science and systemic population health.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="border-l border-gold/30 pl-4">
                  <div className="font-display text-3xl font-light mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-square rounded-full bg-foreground/5 absolute -right-20 -top-20 w-[120%] blur-3xl" />
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-background border border-rule/30 p-6 rounded-2xl shadow-xl">
                 <Building2 className="w-8 h-8 text-gold mb-4" />
                 <h4 className="font-medium text-sm mb-2">Institutional Collaboration</h4>
                 <p className="text-xs text-muted-foreground">Partnering with Johns Hopkins, AFMC, and Univ. of Cincinnati.</p>
               </motion.div>
               <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-background border border-rule/30 p-6 rounded-2xl shadow-xl translate-y-8">
                 <Microscope className="w-8 h-8 text-gold mb-4" />
                 <h4 className="font-medium text-sm mb-2">Cross-Disciplinary</h4>
                 <p className="text-xs text-muted-foreground">Research spanning hematology, toxicology, and occupational hazards.</p>
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardsSection() {
  const { data: content } = useQuery({
    queryKey: ['content', 'homepage_awards'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.homepage_awards || [];
    }
  });

  const awards = content || [];

  return (
    <section className="py-24 bg-foreground/5 border-b border-rule/30">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4">Recognition</p>
           <h2 className="font-display text-4xl sm:text-5xl font-light tracking-tight">Awards & Honors</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {awards.map((award, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-rule/30 hover:bg-background transition-colors group"
            >
              <div className="flex items-start gap-4 mb-4 sm:mb-0">
                <Award className="w-5 h-5 text-gold mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h3 className="font-medium text-foreground/90">{award.title}</h3>
                  <p className="text-sm text-muted-foreground">{award.org}</p>
                </div>
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full self-start sm:self-auto">
                {award.year}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
