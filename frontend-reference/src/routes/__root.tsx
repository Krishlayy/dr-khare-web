import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import FloatingChatbot from "../components/FloatingChatbot";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr. Supreet Khare — Healthcare Leader, Researcher, Educator" },
      {
        name: "description",
        content:
          "The personal site of Dr. Supreet Khare — healthcare executive, researcher, medical educator, and innovator shaping the future of care.",
      },
      { name: "author", content: "Dr. Supreet Khare" },
      { property: "og:title", content: "Dr. Supreet Khare" },
      {
        property: "og:description",
        content:
          "Healthcare Leader · Researcher · Educator · Innovator. Writing, research, and ideas on the future of medicine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

import { Toaster } from 'sonner';

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RootSEO />
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-gold/30 selection:text-foreground">
          <Nav />
          <AnimatePresence mode="wait">
            <motion.main 
              key={useRouter().state.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-1"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
          <Footer />
          <Toaster position="bottom-right" richColors />
          <FloatingChatbot />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootSEO() {
  const { data: seo } = useQuery({
    queryKey: ['content', 'global_seo'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.global_seo || {};
    }
  });

  return (
    <Helmet>
      <title>{seo?.default_title || "Dr. Supreet Khare"}</title>
      <meta name="description" content={seo?.default_description || "Physician, healthcare executive, and ICMR scholar focused on the critical intersection of occupational health, systemic resilience, and the future of care delivery."} />
      {seo?.favicon_url && <link rel="icon" href={seo.favicon_url} />}
      <meta property="og:title" content={seo?.default_title || "Dr. Supreet Khare"} />
      <meta property="og:description" content={seo?.default_description || "Healthcare Leader · Researcher · Educator"} />
      {seo?.og_image_url && <meta property="og:image" content={seo.og_image_url} />}
      
      {seo?.ga_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${seo.ga_id}`}></script>
      )}
      {seo?.ga_id && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${seo.ga_id}');
          `}
        </script>
      )}
      {seo?.custom_scripts && (
        <script type="text/javascript">{seo.custom_scripts}</script>
      )}
    </Helmet>
  );
}
