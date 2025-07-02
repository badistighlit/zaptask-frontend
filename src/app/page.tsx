"use client";
import {
  Zap,
  Repeat,
  Brain,
  Plug,
  Workflow,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

function FadeInWhenVisible({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 40 },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-[#0e4b80] font-sans">
      {/* Hero */}
      <FadeInWhenVisible>
        <section className="bg-gradient-to-br from-[#e6f0fa] via-white to-[#f9fbfc] text-center py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/logo-transparent.png"
              alt="Zaptask Logo"
              width={220}
              height={80}
              className="mx-auto mb-10 drop-shadow-xl"
              unoptimized
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Work Smart. Not Hard.
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-700">
              Automate tasks, connect your tools, and supercharge your workflow — without writing a single line of code.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="bg-[#0074d9] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[#005fa3] transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="border border-[#0074d9] text-[#0074d9] px-6 py-3 rounded-full hover:bg-[#f0f8ff] transition"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>
      </FadeInWhenVisible>

      {/* Why Zaptask */}
      <FadeInWhenVisible>
        <section className="py-20 px-6 bg-[#f9fbfc]">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold">Why Zaptask?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center text-gray-700">
            {[{
              Icon: Zap,
              title: "Connect your favorite tools",
              text: "Google Calendar, Notion, Trello, Jira, and more — all in one place.",
            }, {
              Icon: Repeat,
              title: "Automate complex workflows",
              text: "Set triggers and actions in minutes. No devs required.",
            }, {
              Icon: Brain,
              title: "AI-powered actions",
              text: "Summarize meetings, extract data from emails, enrich your tasks with AI.",
            }].map(({ Icon, title, text }, i) => (
              <div
                key={i}
                className="flex flex-col items-center px-6 py-8 rounded-xl shadow-sm bg-white hover:shadow-md hover:scale-[1.02] transition-transform duration-300"
              >
                <Icon className="w-10 h-10 text-[#0074d9] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInWhenVisible>

      {/* How It Works */}
      <FadeInWhenVisible>
        <section className="py-20 px-6 bg-gradient-to-br from-white to-[#e6f0fa] text-center">
          <div className="max-w-5xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-gray-700">
            {[
              { Icon: Plug, title: "Connect", text: "Log in with Google, Notion, Jira, and more — instantly via OAuth." },
              { Icon: Workflow, title: "Create", text: "Design powerful automations with a drag & drop workflow builder." },
              { Icon: Rocket, title: "Run & Relax", text: "Let Zaptask do the work. Get notified, track execution, and iterate." },
            ].map(({ Icon, title, text }, i) => (
              <div
                key={i}
                className="flex flex-col items-center px-6 py-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-transform duration-300"
              >
                <Icon className="w-10 h-10 text-[#0074d9] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInWhenVisible>

      {/* Screenshot */}
      <FadeInWhenVisible>
        <section className="py-20 px-6 bg-[#eff6ff] text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">See Zaptask in Action</h2>
            <Image
              src="/screenshot-demo.png"
              alt="Zaptask Demo"
              width={800}
              height={400}
              className="rounded-xl shadow-xl mx-auto"
            />
          </div>
        </section>
      </FadeInWhenVisible>

      {/* Testimonial */}
      <FadeInWhenVisible>
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl italic text-gray-700">
              “Zaptask saved our ops team 20 hours a week. Absolute game changer.”
            </blockquote>
            <p className="mt-4 font-semibold text-[#0e4b80]">
              — Camille, Ops Manager @ StartupX
            </p>
          </div>
        </section>
      </FadeInWhenVisible>

      {/* CTA */}
      <FadeInWhenVisible>
        <section className="py-20 px-6 bg-gradient-to-r from-[#0074d9] to-[#0e4b80] text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Start free — no credit card required.</h2>
          <Link
            href="/register"
            className="inline-block mt-4 bg-white text-[#0074d9] px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Create My First Workflow
          </Link>
        </section>
      </FadeInWhenVisible>

      {/* Footer */}
      <footer className="bg-[#0e4b80] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div>
            <Image
              src="/logo-transparent.png"
              alt="Zaptask Logo"
              width={100}
              height={30}
              className="mb-4"
            />
            <p className="text-sm">Work Smart. Not Hard.</p>
          </div>
          <div className="flex flex-col md:flex-row md:justify-end gap-4 text-sm">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
