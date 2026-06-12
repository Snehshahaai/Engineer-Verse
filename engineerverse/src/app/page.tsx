import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Zap,
  Code2,
  Users,
  Trophy,
  BookOpen,
  Rocket,
  Brain,
  GitFork,
  Target,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Project Hub",
    description:
      "Showcase your projects, get feedback, and fork ideas from the community.",
    color: "var(--primary)",
    gradient: "from-[#6c5ce7] to-[#a29bfe]",
  },
  {
    icon: TrendingUp,
    title: "Skill Tree",
    description:
      "Track your skills like a game. Unlock nodes and level up as you learn.",
    color: "var(--secondary)",
    gradient: "from-[#00cec9] to-[#55efc4]",
  },
  {
    icon: Users,
    title: "Team Finder",
    description:
      "Find teammates for your projects and hackathons. Like Tinder, but for teams.",
    color: "var(--accent)",
    gradient: "from-[#fd79a8] to-[#fdcbdd]",
  },
  {
    icon: BookOpen,
    title: "Viva Simulator",
    description:
      "Practice viva questions for Java, DBMS, OS, CN and ace your exams.",
    color: "var(--warning)",
    gradient: "from-[#fdcb6e] to-[#ffeaa7]",
  },
  {
    icon: Target,
    title: "Placement Prep",
    description:
      "Aptitude, DSA, MCQs, and mock interviews — everything you need to get placed.",
    color: "var(--success)",
    gradient: "from-[#00b894] to-[#55efc4]",
  },
  {
    icon: Rocket,
    title: "Roadmaps",
    description:
      "Interactive career roadmaps for AI, Web Dev, DevOps, and more.",
    color: "var(--primary-light)",
    gradient: "from-[#a29bfe] to-[#6c5ce7]",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description:
      "Discover hackathons, register teams, and track your submissions.",
    color: "var(--error)",
    gradient: "from-[#ff6b6b] to-[#ee5a24]",
  },
  {
    icon: GitFork,
    title: "Portfolio Generator",
    description:
      "Auto-generate a beautiful portfolio website and resume from your profile.",
    color: "var(--secondary)",
    gradient: "from-[#00cec9] to-[#81ecec]",
  },
  {
    icon: Brain,
    title: "AI Mentor",
    description:
      "Get personalized project ideas, resume reviews, and learning plans.",
    color: "var(--primary)",
    gradient: "from-[#6c5ce7] to-[#fd79a8]",
    badge: "Coming Soon",
  },
];

const stats = [
  { value: "10K+", label: "Students", icon: Users },
  { value: "5K+", label: "Projects", icon: Code2 },
  { value: "200+", label: "Skills", icon: Star },
  { value: "50+", label: "Hackathons", icon: Trophy },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and build your engineering identity with skills, projects, and links.",
  },
  {
    step: "02",
    title: "Learn & Build",
    description: "Follow roadmaps, practice viva, solve DSA problems, and build real projects.",
  },
  {
    step: "03",
    title: "Connect & Collaborate",
    description: "Find teammates, join hackathons, get code reviews, and grow your network.",
  },
  {
    step: "04",
    title: "Get Placed",
    description: "Generate your portfolio, prepare for interviews, and land your dream job.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--text-secondary) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)]" />
            <span className="text-xs font-medium text-[var(--primary-light)]">
              The Ultimate Platform for Engineering Students
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            <span className="text-[var(--text-primary)]">Learn. Build.</span>
            <br />
            <span className="text-gradient animate-gradient bg-[length:200%_200%]" style={{ backgroundImage: "linear-gradient(135deg, #6c5ce7, #a29bfe, #00cec9, #6c5ce7)" }}>
              Engineer Your Future.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-slide-up stagger-1 leading-relaxed">
            One platform to track skills, showcase projects, find teammates,
            prepare for placements, and build your engineering portfolio.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link
              href="/register"
              className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30"
            >
              <Rocket className="w-5 h-5" />
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="#features"
              className="btn-secondary px-8 py-3.5 text-base rounded-xl"
            >
              Explore Features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Floating Badges */}
          <div className="mt-16 flex items-center justify-center gap-6 flex-wrap animate-slide-up stagger-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
              <Shield className="w-3.5 h-3.5 text-[var(--success)]" />
              100% Free & Open Source
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
              <Star className="w-3.5 h-3.5 text-[var(--warning)]" />
              Built by Students, For Students
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
              <Zap className="w-3.5 h-3.5 text-[var(--primary-light)]" />
              AI-Powered Features
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--border-default)] flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-[var(--primary-light)] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative py-16 border-y border-[var(--border-default)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center animate-slide-up stagger-${i + 1}`}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-[var(--primary-light)]" />
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything You Need to{" "}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              From learning to placement — EngineerVerse has every tool an
              engineering student needs, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] card-hover animate-slide-up stagger-${
                  (i % 6) + 1
                }`}
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    {feature.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 bg-[var(--bg-secondary)]/50 border-y border-[var(--border-default)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Get started in minutes and transform your engineering journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative flex gap-5 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] card-hover animate-slide-up stagger-${
                  i + 1
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="community" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="hero-orb hero-orb-1" style={{ opacity: 0.1 }} />
          <div className="hero-orb hero-orb-2" style={{ opacity: 0.1 }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Ready to Start Your{" "}
            <span className="text-gradient">Engineering Journey</span>?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Join thousands of engineering students who are building, learning,
            and growing together on EngineerVerse.
          </p>
          <Link
            href="/register"
            className="btn-primary px-10 py-4 text-base rounded-xl shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30"
          >
            <Rocket className="w-5 h-5" />
            Create Your Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
