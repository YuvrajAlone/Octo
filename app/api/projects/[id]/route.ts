import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Demo only: simulate a successful deletion.
  return NextResponse.json({
    success: true,
    message: `Project ${id} deleted successfully`,
  });
}

const initialProjects = [
  {
    _id: "proj-1",
    name: "SaaSify Landing Page",
    description:
      "A modern SaaS landing page with dark mode accents, hero section, bento grid features, pricing table, and testimonials.",
    version: 1,
    status: "completed",
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    messages: [
      {
        role: "user",
        content:
          "Create a modern SaaS landing page for an AI productivity platform called SaaSify",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        role: "assistant",
        content:
          "I have built the SaaSify landing page with a modern design system including Hero, Features, Pricing, and Testimonial components.",
        timestamp: new Date(Date.now() - 86400000 * 2 + 5000).toISOString(),
      },
    ],
    files: {
      "/App.js": `import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import './styles.css';

export default function App() {
  return (
    <div className='min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-red-500 selection:text-white'>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}`,
      "/components/Header.js": `import React from 'react';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100'>
      <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='size-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm'>
            S
          </div>
          <span className='font-bold text-xl tracking-tight text-zinc-900'>SaaSify</span>
        </div>
        <nav className='hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600'>
          <a href='#features' className='hover:text-zinc-900 transition'>Features</a>
          <a href='#pricing' className='hover:text-zinc-900 transition'>Pricing</a>
          <a href='#about' className='hover:text-zinc-900 transition'>About</a>
        </nav>
        <div className='flex items-center gap-4'>
          <button className='text-sm font-medium text-zinc-700 hover:text-zinc-900 transition hidden sm:block'>Sign in</button>
          <button className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer'>
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}`,
      "/components/Hero.js": `import React from 'react';

export default function Hero() {
  return (
    <section className='relative py-20 md:py-28 max-w-7xl mx-auto px-6 text-center overflow-hidden'>
      <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold mb-6'>
        <span className='size-2 rounded-full bg-red-600 animate-pulse'></span>
        Introducing SaaSify v2.0 AI Platform
      </div>
      <h1 className='text-5xl md:text-7xl font-bold tracking-tighter text-zinc-950 leading-[1.08] max-w-4xl mx-auto mb-6'>
        Build AI Workflows <br className='hidden sm:block' />
        <span className='bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'>10x Faster Than Ever</span>
      </h1>
      <p className='text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed'>
        Automate your business processes, analyze data instantly, and scale your operations with enterprise-grade autonomous AI agents.
      </p>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
        <button className='w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-base shadow-lg hover:shadow-red-500/25 transition cursor-pointer'>
          Start Free Trial
        </button>
        <button className='w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-xl text-base transition cursor-pointer'>
          Watch Demo
        </button>
      </div>
    </section>
  );
}`,
      "/components/Features.js": `import React from 'react';

export default function Features() {
  const features = [
    { title: "Autonomous Agents", desc: "Deploy intelligent agents that handle complex multi-step workflows automatically." },
    { title: "Real-time Analytics", desc: "Gain deep insights into your operations with live telemetry and custom dashboards." },
    { title: "Enterprise Security", desc: "SOC2 Type II compliant with end-to-end encryption for all data in transit." }
  ];

  return (
    <section id='features' className='py-20 bg-zinc-50/80 border-y border-zinc-100'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 mb-3'>Engineered for Modern Teams</h2>
          <p className='text-zinc-600 text-base'>Everything you need to deploy, monitor, and scale your AI automation infrastructure.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((f, i) => (
            <div key={i} className='p-8 bg-white rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition'>
              <div className='size-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl mb-6'>
                0{i + 1}
              </div>
              <h3 className='text-xl font-bold text-zinc-900 mb-2'>{f.title}</h3>
              <p className='text-zinc-600 text-sm leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      "/components/Pricing.js": `import React from 'react';

export default function Pricing() {
  return (
    <section id='pricing' className='py-20 max-w-7xl mx-auto px-6'>
      <div className='text-center max-w-2xl mx-auto mb-16'>
        <h2 className='text-3xl font-bold tracking-tight text-zinc-900 mb-3'>Simple, Transparent Pricing</h2>
        <p className='text-zinc-600 text-base'>No hidden fees. Scale up or down anytime.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        <div className='p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm'>
          <h3 className='text-xl font-bold text-zinc-900 mb-2'>Starter</h3>
          <p className='text-zinc-500 text-sm mb-6'>Perfect for small projects and side hustles</p>
          <div className='text-4xl font-bold text-zinc-950 mb-6'>$29 <span className='text-base font-normal text-zinc-500'>/mo</span></div>
          <button className='w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-xl transition'>Choose Starter</button>
        </div>
        <div className='p-8 rounded-2xl border-2 border-red-600 bg-white shadow-md relative'>
          <span className='absolute -top-3 right-6 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full'>POPULAR</span>
          <h3 className='text-xl font-bold text-zinc-900 mb-2'>Pro</h3>
          <p className='text-zinc-500 text-sm mb-6'>For growing businesses demanding full power</p>
          <div className='text-4xl font-bold text-zinc-950 mb-6'>$79 <span className='text-base font-normal text-zinc-500'>/mo</span></div>
          <button className='w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition'>Choose Pro</button>
        </div>
      </div>
    </section>
  );
}`,
      "/components/Footer.js": `import React from 'react';

export default function Footer() {
  return (
    <footer className='py-12 bg-zinc-900 text-zinc-400 text-sm border-t border-zinc-800'>
      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-white text-lg'>SaaSify</span>
          <span className='text-zinc-500'>— Built with BuilderAI</span>
        </div>
        <p className='text-zinc-500'>© {new Date().getFullYear()} SaaSify Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}`,
      "/styles.css": `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
    },
  },
  {
    _id: "proj-2",
    name: "Personal Portfolio",
    description:
      "Minimalist personal portfolio website for designers and developers.",
    version: 1,
    status: "completed",
    published: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    messages: [
      {
        role: "user",
        content: "Create a minimalist personal portfolio website",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ],
    files: {
      "/App.js": `import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100 font-sans p-8 md:p-16'>
      <div className='max-w-4xl mx-auto'>
        <header className='mb-16'>
          <h1 className='text-4xl font-bold tracking-tight mb-2'>Alex Rivera</h1>
          <p className='text-zinc-400 text-lg'>Product Designer & Creative Developer</p>
        </header>
        <section className='mb-16'>
          <h2 className='text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6'>Selected Projects</h2>
          <div className='space-y-6'>
            <div className='p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition'>
              <h3 className='text-xl font-bold mb-2'>Antigravity Studio</h3>
              <p className='text-zinc-400 text-sm mb-4'>AI design system and generative interface framework.</p>
              <span className='text-xs font-mono text-red-400'>React • Tailwind • WebGL</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}`,
      "/styles.css": `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #fafafa; }`,
    },
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const project = initialProjects.find((project) => project._id === id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}
