import { Link } from "@tanstack/react-router";
import { useState } from "react";
import api from "../lib/api";
import { Send, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [segment, setSegment] = useState("general");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { data: footerData } = useQuery({
    queryKey: ['content', 'global_footer'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.global_footer;
    }
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await api.post('/newsletter/subscribe', { email, name, segment });
      setStatus("success");
      setEmail("");
      setName("");
    } catch (err) {
      setStatus("error");
    }
  };

  if (!footerData) return null; // or a skeleton

  const defaultLinks = [
    { category: "Navigation", label: "Home", url: "/" },
    { category: "Navigation", label: "About", url: "/about" },
    { category: "Navigation", label: "Journey", url: "/journey" },
    { category: "Resources", label: "Publications", url: "/publications" },
    { category: "Resources", label: "Insights", url: "/insights" },
    { category: "Connect", label: "Contact", url: "/contact" },
  ];
  const linksToUse = footerData.links && footerData.links.length > 0 ? footerData.links : defaultLinks;

  // Group links by category
  const categories = [...new Set(linksToUse.map((l: any) => l.category))];

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        
        {/* Top Section - Newsletter & Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 border-b border-background/10 pb-16">
          <div>
            <div className="font-display text-2xl font-light tracking-tight mb-2">
              {footerData.title || "Dr. Supreet Khare"}
            </div>
            {footerData.credentials && (
              <div className="text-xs text-background/60 tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-gold inline-block"></span>
                {footerData.credentials}
              </div>
            )}
            <p className="max-w-md text-base leading-relaxed text-background/70 font-light">
              {footerData.bio || "Physician, Healthcare Executive, and Researcher dedicated to advancing evidence-based care, digital health strategy, and occupational medicine."}
            </p>
          </div>

          <div className="bg-background/5 rounded-2xl p-8 border border-background/10">
            <p className="font-display text-xl mb-2">{footerData.newsletter_title || "Newsletter"}</p>
            <p className="text-sm text-background/60 mb-6 leading-relaxed">
              {footerData.newsletter_desc || "Join my newsletter for the latest insights in healthcare leadership, research, and occupational medicine."}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name (Optional)" 
                className="w-full bg-background/10 border border-background/20 rounded-xl py-3 px-5 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-gold/50 transition-colors"
                disabled={status === 'loading' || status === 'success'}
              />
              <div className="relative flex items-center gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="flex-1 bg-background/10 border border-background/20 rounded-xl py-3 px-5 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-gold/50 transition-colors"
                  disabled={status === 'loading' || status === 'success'}
                />
                <select 
                  value={segment} 
                  onChange={(e) => setSegment(e.target.value)}
                  className="bg-background/10 border border-background/20 rounded-xl py-3 px-3 text-sm text-background/80 focus:outline-none focus:border-gold/50 transition-colors"
                  disabled={status === 'loading' || status === 'success'}
                >
                  <option value="general" className="text-foreground">General Updates</option>
                  <option value="patients" className="text-foreground">Patients</option>
                  <option value="professionals" className="text-foreground">Professionals</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="w-full rounded-xl bg-gold text-foreground py-3 text-sm font-medium transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>
            {status === 'success' && <p className="text-xs text-green-400 mt-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Subscribed to the brief.</p>}
            {status === 'error' && <p className="text-xs text-red-400 mt-3">An error occurred. Please try again.</p>}
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-background/10">
          {categories.map((cat: any, i: number) => (
            <div key={i}>
              <p className="font-medium text-background tracking-wider uppercase text-xs mb-6">{cat}</p>
              <ul className="space-y-4 text-sm text-background/60">
                {linksToUse.filter((l: any) => l.category === cat).map((link: any, idx: number) => (
                  <li key={idx}>
                    {link.url.startsWith('/') ? (
                      <Link to={link.url} className="hover:text-gold transition-colors">{link.label}</Link>
                    ) : (
                      <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:text-right flex flex-col items-start md:items-end justify-end">
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-gold/50 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-foreground">
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Bottom Section - Legal */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-background/40">
          <p>{footerData.copyright || `© ${new Date().getFullYear()} Dr. Supreet Khare. All rights reserved.`}</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link to="/" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-background transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-background transition-colors">Medical Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
