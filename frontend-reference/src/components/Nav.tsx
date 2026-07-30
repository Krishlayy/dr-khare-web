import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function Nav() {
  const { data: seo } = useQuery({
    queryKey: ['content', 'global_seo'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.global_seo || {};
    }
  });

  const { data: footer } = useQuery({
    queryKey: ['content', 'global_footer'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.global_footer || {};
    }
  });

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/journey", label: "Journey" },
    { href: "/publications", label: "Publications" },
    { href: "/reviews", label: "Reviews" },
    { href: "/insights", label: "Insights" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rule/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex flex-col items-start">
          {seo?.logo_url ? (
            <img src={seo.logo_url} alt="Site Logo" className="h-8 w-auto mb-1 object-contain" />
          ) : (
            <>
              <span className="font-display text-lg font-medium tracking-tight">
                {footer?.title || "Dr. Supreet Khare"}
              </span>
              {footer?.credentials && (
                <span className="text-xs text-muted-foreground mt-0.5 tracking-widest">
                  {footer.credentials}
                </span>
              )}
            </>
          )}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="hidden shrink-0 rounded-full border border-foreground/80 px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background md:inline-flex"
        >
          Get in touch
        </Link>
      </div>
    </header>
  );
}
