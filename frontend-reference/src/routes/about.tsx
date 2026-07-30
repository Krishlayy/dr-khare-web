import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const Route = createFileRoute('/about')({
  component: AboutRoute,
});

function AboutRoute() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'about_page'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.about_page || {};
    }
  });

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 md:px-10">
      <div className="mb-16">
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">About Dr. Supreet Khare</h1>
      </div>

      <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
        <p className="lead text-xl text-muted-foreground whitespace-pre-line">
          {content.biography_lead}
        </p>

        <p className="whitespace-pre-line">
          {content.biography_body}
        </p>

        <h2 className="font-display mt-10">Clinical Leadership & Advocacy</h2>
        <p className="whitespace-pre-line">
          {content.clinical_leadership}
        </p>

        <h2 className="font-display mt-10">Research & Academic Contributions</h2>
        <p className="whitespace-pre-line">
          {content.research}
        </p>
      </div>
    </div>
  );
}
