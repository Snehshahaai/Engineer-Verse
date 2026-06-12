import Link from "next/link";
import { Zap, MessageCircle, Link2, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">EngineerVerse</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              The all-in-one platform for engineering students to learn, build, and grow together.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:bg-[var(--bg-tertiary)] transition-all">
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:bg-[var(--bg-tertiary)] transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:bg-[var(--bg-tertiary)] transition-all">
                <Link2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:bg-[var(--bg-tertiary)] transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {["Projects", "Skill Tree", "Team Finder", "Roadmaps", "Hackathons"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {["Documentation", "API", "Blog", "Community", "Support"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Careers", "Privacy", "Terms", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border-default)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} EngineerVerse. Built with ❤️ for engineers.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Made by Sneh Shah
          </p>
        </div>
      </div>
    </footer>
  );
}
