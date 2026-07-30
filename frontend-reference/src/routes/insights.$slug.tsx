import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { format } from 'date-fns';

export const Route = createFileRoute('/insights/$slug')({
  component: InsightDetailRoute,
});

function InsightDetailRoute() {
  const { slug } = Route.useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    },
  });

  const { data: related } = useQuery({
    queryKey: ['blogs-related', post?.category],
    enabled: !!post?.category,
    queryFn: async () => {
      const res = await api.get('/blogs', { params: { status: 'published', category: post.category, limit: 3 } });
      return res.data.filter((p: any) => p._id !== post._id).slice(0, 2);
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading article...</div>;
  if (!post) return <div className="p-10 text-center">Article not found.</div>;

  return (
    <article className="mx-auto max-w-4xl px-6 py-20 md:px-10">
      <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        &larr; Back to Insights
      </Link>
      
      <header className="mt-10 mb-12 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mb-6 font-medium uppercase tracking-widest">
          <span>{post.category || 'Article'}</span>
          <span>&bull;</span>
          <span>{format(new Date(post.publishDate || post.createdAt), 'MMM d, yyyy')}</span>
          <span>&bull;</span>
          <span>{post.readTimeMinutes} min read</span>
        </div>
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl md:text-6xl leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      <div className="flex items-center justify-center gap-4 mb-16 pb-12 border-b border-rule/60">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-foreground/10">
          <img src="/assets/portrait.jpg" alt="Dr. Supreet Khare" className="w-full h-full object-cover" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">Dr. Supreet Khare</p>
          <p className="text-xs text-muted-foreground">Healthcare Executive & ICMR Scholar</p>
        </div>
      </div>

      {post.coverImage && (
        <figure className="mb-16">
          <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl object-cover shadow-sm aspect-[21/9]" />
        </figure>
      )}

      <div className="prose prose-neutral dark:prose-invert prose-lg max-w-3xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {post.tags?.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-rule/60">
          <p className="text-sm text-muted-foreground mb-3 font-medium">Tagged in:</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-foreground/5 rounded-full text-xs text-foreground/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {related && related.length > 0 && (
        <div className="mt-24 pt-16 border-t border-rule/60 border-2">
          <h3 className="font-display text-3xl mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {related.map((rp: any) => (
              <Link key={rp._id} to="/insights/$slug" params={{ slug: rp.slug }} className="group block">
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-foreground/5">
                  {rp.coverImage && <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <h4 className="font-display text-xl group-hover:text-foreground/80 transition-colors">{rp.title}</h4>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{rp.excerpt || rp.content.replace(/<[^>]+>/g, '')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
