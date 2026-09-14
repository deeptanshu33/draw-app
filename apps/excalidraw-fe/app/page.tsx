import Link from "next/link";
import { Pencil, Users, Maximize, Shapes, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Draw together in real time with WebSocket-powered sync. Every stroke appears instantly for all participants.",
  },
  {
    icon: Maximize,
    title: "Infinite Canvas",
    description:
      "Pan and zoom freely across a boundless workspace. Your ideas are never limited by screen size.",
  },
  {
    icon: Shapes,
    title: "Shape Tools",
    description:
      "Rectangles, circles, freehand drawing — all the primitives you need to sketch concepts quickly.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* ── Ambient glow ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Nav ── */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-5 animate-slide-down"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-gradient)" }}
          >
            <Pencil size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            DrawBoard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="btn-ghost text-sm py-2 px-5 no-underline">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-5 no-underline">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
            Open-source collaborative whiteboard
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-slide-up"
            style={{ color: "var(--text-primary)" }}
          >
            Sketch ideas,{" "}
            <span className="gradient-text">together</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto animate-slide-up delay-100"
            style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
          >
            A minimal, real-time collaborative whiteboard. Create a room, share
            the link, and start drawing with your team — instantly.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 animate-slide-up delay-200">
            <Link href="/signup" className="btn-primary no-underline">
              Start Drawing <ArrowRight size={16} />
            </Link>
            <Link href="/signin" className="btn-ghost no-underline">
              I have an account
            </Link>
          </div>
        </div>

        {/* ── Features ── */}
        <section className="w-full max-w-4xl mx-auto mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass-card p-6 text-left animate-slide-up opacity-0`}
              style={{
                animationDelay: `${300 + i * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: "var(--bg-surface-hover)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <f.icon size={20} style={{ color: "var(--accent-from)" }} />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {f.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 text-center py-6 text-xs"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-default)",
        }}
      >
        Built with Next.js, WebSockets & Canvas API
      </footer>
    </div>
  );
}
