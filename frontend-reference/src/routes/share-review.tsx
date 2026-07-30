import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ReviewQuestionnaire } from '../components/ReviewQuestionnaire';

export const Route = createFileRoute('/share-review')({
  component: LeaveReviewRoute,
});

function LeaveReviewRoute() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 md:px-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">Share Your Experience</h1>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          We deeply value your feedback. Help us improve our care by sharing your journey.
        </p>
        <Link 
          to="/reviews"
          className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-foreground hover:text-gold transition-colors gap-2 px-6 py-3 border border-rule/30 rounded-full"
        >
          View Patient Experiences
        </Link>
      </div>

      <ReviewQuestionnaire onClose={() => navigate({ to: '/reviews' })} />
    </div>
  );
}
