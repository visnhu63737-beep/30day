import React, { useState, useEffect, useMemo } from 'react';
import { getMonth, getDate, format } from 'date-fns';
import { CheckCircle2, Circle, Trophy, Lock, Brain, MonitorPlay, Users, Presentation, Activity, CalendarDays, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =======================
// DB: 30-Day Task Content
// =======================

const SKILL_TASKS = [
  "Understand basic prompt engineering & zero-shot prompting", "Write a complex system prompt for a specialized persona", "Build a simple chatbot using structured prompts (Playground)", "Experiment with few-shot and chain-of-thought prompting", "Set up a local development environment for AI APIs", "Write your first script to call the OpenAI API", "Extract structured JSON data from unstructured text using AI",
  "Build a basic semantic search script with embeddings", "Integrate a database (Supabase/Firebase) to store AI logs", "Create an automated email summarizer script", "Build a multi-step AI workflow using Zapier / Make", "Add conversational memory to your custom chatbot", "Implement function calling / tool use in your AI script", "Deploy your first AI web app to Vercel/Netlify", "Handle API errors and rate limits gracefully in code",
  "Build a lead scoring automation with AI", "Create a custom RAG (Retrieval-Augmented Generation) pipeline", "Implement vector database (Pinecone/Weaviate) for memory", "Fine-tune a small open-source model using local tools", "Optimize prompts to reduce token usage by 30%", "Build an AI agent that can browse the web", "Integrate voice AI (Whisper/ElevenLabs) into your app", "Build a dynamic UI generator based on text prompt",
  "Implement a multi-agent system (AutoGen/CrewAI)", "Build a client-ready SaaS dashboard with user auth", "Set up a Stripe integration for your AI tool", "Add caching mechanisms to reduce API latency", "Run penetration testing on your AI prompt (jailbreak defense)", "Package your automation into a sellable template", "Launch your fully functional AI minimum viable product"
];

const BUSINESS_TASKS = [
  "Identify 3 profitable niches", "Analyze competitors in chosen niche", "Define your ideal customer profile (ICP)", "Refine your agency offer into a 1-line value proposition", "Set up a professional social media profile", "Create a pricing model for your first service", "Write a 1-page business plan",
  "Build a simple lead generation landing page", "Draft 3 cold email templates", "Set up professional email tracking", "Manually build a list of 20 qualified leads", "Send your first 5 personalized cold outbound messages", "Follow up on your first batch of outbound", "Document a case study of past work or a personal project", "Create a 5-minute video sales letter (VSL)",
  "Optimize your landing page for conversions", "Run a small experiment with LinkedIn outreach", "Conduct a mock sales call with a peer", "Refine your contract and proposal templates", "Handle common sales objections in a script", "Launch a small lead-magnet campaign", "Review cold outreach metrics", "Set up a CRM (HubSpot/Notion) for tracking deals",
  "Send 20 highly targeted outbound messages", "Follow up with all leads in your pipeline", "A/B test two different subject lines", "Attend or engage in a niche community event", "Pitch your service locally or on a freelance platform", "Review business metrics and refine your 30-day strategy", "Draft next 30 day growth plan"
];

const MINDSET_TASKS = [
  "Delete 1 distracting app from your phone", "Write your main 30-day goal on a sticky note", "Read 10 pages of a business book", "Track how you spend every hour today", "Identify and eliminate your biggest daily time-waster", "Practice 10 minutes of meditation or deep breathing", "Reflect on week 1 execution",
  "Wake up 30 minutes earlier than usual", "Implement the Pomodoro technique for 2 hours", "Go for a 20-minute walk with no electronics", "Write down 3 things you are grateful for", "Perform a high-intensity workout", "Say 'no' to a low-leverage request or task", "Journal about a recent failure and the lesson learned", "Do a dopamine detox: no social media all day",
  "Read an article contradicting your current beliefs", "Plan tomorrow's schedule tonight", "Take a cold shower or discomfort challenge", "Identify 1 limiting belief and write its counter", "Execute a 3-hour deep work block", "Visualize your 1-year success in detail", "Track calories for exactly 1 day", "Reach out to a mentor or admin",
  "Audit your inner circle: who gives/takes energy?", "Read 20 pages of a mindset book", "Take a full evening completely offline", "Review your 30-day progress and celebrate small wins", "Identify the biggest friction point in your routine", "Write your operating principles for the next 6 months", "Plan your rewards for milestone completions"
];

const AI_TOOLS_TASKS = [
  "Perplexity AI: Deep research assistant. Try searching a complex niche trend.", "Claude 3.5 Sonnet: Advanced logic. Feed it your code for an architecture review.", "Midjourney: High-end image generation. Create an ad asset.", "Gamma.app: AI presentations. Build a pitch deck in 5 mins.", "ElevenLabs: Voice AI. Clone a voice or generate a VSL track.", "RunwayML: Video AI. Turn a still image into a 4-sec video.", "v0 by Vercel: UI generator. Prompt a dark-mode dashboard component.",
  "Cursor: AI Code Editor. Refactor a messy function.", "Make.com: Visual automation. Connect 2 apps together.", "Chatbase/Botsonic: Custom chatbots. Train a bot on a single website.", "Synthesia: AI Avatars. Create a talking head video tutorial.", "Fireflies.ai: Meeting notes. Summarize a youtube podcast URL.", "Descript: Audio/Video editor. Edit video seamlessly by editing text.", "Leonardo.ai: Game/Asset generation. Generate a 3D style icon.", "HeyGen: Personalized videos. Generate a video translation.",
  "Zapier Interfaces: Basic UI for automation. Build a form.", "Mistral (Le Chat): Fast open weights. Test its multi-lingual logic.", "Framer AI: Site builder. Generate a landing page structure.", "Relume: Wireframing AI. Build a 5-section site map.", "Suno/Udio: AI Music. Generate a lo-fi background track.", "Luma Dream Machine: High-quality AI video generation.", "Grok: Real-time Twitter AI breakdown", "Phind / Devv.ai: Developer-focused search engines.",
  "Copy.ai / Jasper: Copywriting. Generate 5 variations of a Facebook ad.", "Bolt.new: Full-stack environments. Spawn a working app in browser.", "Lovable.dev: React app generation.", "Superhuman AI: Email management. Auto-draft replies.", "Mem.ai: AI-powered workspace. Auto-connect your notes.", "AutoGPT / CrewAI: AI Agents. Watch multiple agents debate.", "OpenAI Swarm: Multi-agent system orchestration."
];

const CASE_STUDY_TASKS = [
  "Analyze Netflix's algorithmic thumbnail personalization", "Breakdown Amazon's dynamic pricing engine", "Study Spotify's Discover Weekly recommendation logic", "Understand how Duolingo uses gamification for retention", "Analyze Alex Hormozi's $100M Offers framework", "Study Gymshark's influencer marketing strategy", "Breakdown Airbnb's early Craigslist growth hack",
  "Analyze how Zapier uses programmatic SEO", "Study Notion's community-led growth model", "Understand Stripe's developer-first API design", "Breakdown MrBeast's YouTube thumbnail retention strategies", "Analyze Morning Brew's newsletter referral program", "Study how TikTok's algorithm prioritizes watch time", "Breakdown Figma's multiplayer collaboration architecture", "Analyze Tesla's direct-to-consumer sales model",
  "Study how OpenAI scaled ChatGPT to 100M users", "Breakdown Substack's creator monetization strategy", "Analyze Apple's ecosystem lock-in strategies", "Study Discord's transition from gamers to broad communities", "Breakdown OnlyFans' decentralized creator economy", "Analyze Shopify's arming-the-rebels business model", "Breakdown linear vs exponential scaling in SaaS", "Study Midjourney's choice to use Discord as a UI",
  "Breakdown Canva's template-driven SEO empire", "Analyze Y Combinator's network effects", "Study how Vercel open-sourced Next.js for enterprise growth", "Breakdown Robinhood's frictionless onboarding", "Analyze Red Bull's media company approach to selling drinks", "Summarize the #1 pattern across all 30 case studies", "Draft your own personal case study projection"
];

const INTERVIEW_TASKS = [
  "Practice explaining your current side project in exactly 60 seconds", "Record yourself answering 'Tell me about yourself' and watch it", "Explain what an API is like I am a 5-year-old", "Write down your biggest weakness and frame it positively", "Prepare a STAR method answer for a time you failed", "Practice answering: 'Why do you want to work here?'", "Do a mock greeting and small talk with a mirror",
  "Explain a complex technical layout (e.g., React state) simply", "Answer 'Where do you see yourself in 5 years?'", "Practice defending a controversial engineering or business decision", "Record your answer to 'Describe a conflict with a coworker'", "Condense your resume into a 3-bullet oral summary", "Practice active listening: summarize a 5-minute podcast", "Draft 3 high-quality questions to ask an interviewer", "Do a random whiteboarding problem on LeetCode/HackerRank",
  "Practice system design for a simple URL shortener", "Answer 'How do you handle scope creep?'", "Explain the trade-offs of using NoSQL vs SQL", "Record your response to 'What is your proudest achievement?'", "Do a peer mock interview for 30 minutes", "Practice slowing down your speaking pace", "Refine answering behavioral questions smoothly", "Answer 'Tell me about a time you had to learn a new skill fast'",
  "Explain how you prioritize tasks when everything is urgent", "Practice salary negotiation strategies and scripts", "Review your body language and posture during a video call", "Conduct a full 45-minute mock interview with an AI or Peer", "Refine your unique 'elevator pitch' to be unforgettable", "Review your entire communication style from Day 1 to Day 30", "Deliver a full flawless 3-minute professional intro"
];

type CategoryKey = "Skill" | "Business" | "Mindset" | "AI Tools" | "Case Study" | "Interview Prep";

interface TaskData {
  id: string;
  category: CategoryKey;
  title: string;
  difficulty: "Basic" | "Medium" | "Advanced" | "Expert";
  completed: boolean;
  notes: string;
}

const CATEGORIES: { key: CategoryKey; icon: React.ElementType; color: string; border: string; bg: string }[] = [
  { key: "Skill", icon: MonitorPlay, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { key: "Business", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { key: "Mindset", icon: Brain, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
  { key: "AI Tools", icon: Lock, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { key: "Case Study", icon: Users, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  { key: "Interview Prep", icon: Presentation, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
];

const getDifficulty = (dayIdx: number) => {
  if (dayIdx < 7) return "Basic";
  if (dayIdx < 15) return "Medium";
  if (dayIdx < 23) return "Advanced";
  return "Expert";
};

// Return a structured set of 6 tasks for the specific day
const getDailyPlan = (dayOfMonth: number): TaskData[] => {
  const dayIdx = dayOfMonth - 1; // 0-based
  return [
    { id: `day-${dayOfMonth}-skill`, category: "Skill", title: SKILL_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" },
    { id: `day-${dayOfMonth}-business`, category: "Business", title: BUSINESS_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" },
    { id: `day-${dayOfMonth}-mindset`, category: "Mindset", title: MINDSET_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" },
    { id: `day-${dayOfMonth}-aitools`, category: "AI Tools", title: AI_TOOLS_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" },
    { id: `day-${dayOfMonth}-casestudy`, category: "Case Study", title: CASE_STUDY_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" },
    { id: `day-${dayOfMonth}-interview`, category: "Interview Prep", title: INTERVIEW_TASKS[dayIdx], difficulty: getDifficulty(dayIdx), completed: false, notes: "" }
  ];
};

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(() => getDate(new Date()));
  const [isApril, setIsApril] = useState<boolean>(() => getMonth(new Date()) === 3);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [mounted, setMounted] = useState(false);

  // For visual developer testing / over-ride
  const enableDebugDay = (day: number) => {
    setIsApril(true);
    setCurrentDay(day);
  };

  useEffect(() => {
    // Check local storage for the given day
    if (isApril && currentDay >= 1 && currentDay <= 30) {
      const storageKey = `exec_dash_apr_${currentDay}_2026`;
      const savedTasks = localStorage.getItem(storageKey);
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        const initialTasks = getDailyPlan(currentDay);
        setTasks(initialTasks);
        localStorage.setItem(storageKey, JSON.stringify(initialTasks));
      }
    }
    setMounted(true);
  }, [currentDay, isApril]);

  // Save changes to tasks
  useEffect(() => {
    if (tasks.length > 0 && isApril) {
      const storageKey = `exec_dash_apr_${currentDay}_2026`;
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, currentDay, isApril]);

  const toggleTask = (taskId: string) => setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  const updateNote = (taskId: string, notes: string) => setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, notes } : t));

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  // Compute Streak (Checking all past 30 days)
  const calculateStreak = () => {
    let streak = 0;
    for (let d = currentDay - 1; d >= 1; d--) {
      const key = `exec_dash_apr_${d}_2026`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: TaskData[] = JSON.parse(saved);
        const comp = parsed.filter(t => t.completed).length;
        if ((comp / 6) >= 0.8) streak++;
        else break;
      } else {
        break; // Stop streak measurement if day is entirely empty/not accessed
      }
    }
    return streak;
  };
  const streak = calculateStreak();

  // Final Master Summary (Day 30 computation)
  const masterStats = useMemo(() => {
    if (currentDay !== 30) return null;
    let totalCompleted = 0;
    let totalAssigned = 30 * 6; // 180
    let categoriesCount: Record<string, number> = { "Skill": 0, "Business": 0, "Mindset": 0, "AI Tools": 0, "Case Study": 0, "Interview Prep": 0 };

    for (let d = 1; d <= 30; d++) {
      const saved = localStorage.getItem(`exec_dash_apr_${d}_2026`);
      if (saved) {
        const parsed: TaskData[] = JSON.parse(saved);
        parsed.forEach(t => {
          if (t.completed) {
            totalCompleted++;
            categoriesCount[t.category] += 1;
          }
        });
      }
    }

    const maxCat = Object.keys(categoriesCount).reduce((a, b) => categoriesCount[a] > categoriesCount[b] ? a : b);
    const minCat = Object.keys(categoriesCount).reduce((a, b) => categoriesCount[a] < categoriesCount[b] ? a : b);
    const pct = Math.round((totalCompleted / totalAssigned) * 100);

    let feedback = "";
    if (pct >= 85) feedback = "High execution level. You dominate.";
    else if (pct >= 60) feedback = "Moderate — needs consistency.";
    else feedback = "Low execution — discipline issue.";

    return { totalCompleted, totalAssigned, pct, maxCat, minCat, feedback };
  }, [currentDay, tasks]);

  if (!mounted) return null;

  if (!isApril || currentDay > 30 || currentDay < 1) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1),transparent)] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center border border-zinc-800/60 bg-black/40 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
          <CalendarDays className="w-20 h-20 text-indigo-500/50 mb-6" />
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">
            Program Inactive
          </h1>
          <p className="text-zinc-400 text-center max-w-sm mt-3 leading-relaxed">
            The 30-Day Execution Protocol runs strictly from <strong className="text-zinc-200 font-semibold">April 1st</strong> to <strong className="text-zinc-200 font-semibold">April 30th</strong>. Return when the training window opens.
          </p>
          <div className="mt-8 flex flex-col gap-2 items-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Debug Override</span>
            <div className="flex gap-2">
              <button onClick={() => enableDebugDay(1)} className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-indigo-900 hover:text-indigo-200 hover:border-indigo-500 transition-all rounded-lg text-xs font-semibold">Start Day 1</button>
              <button onClick={() => enableDebugDay(15)} className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-emerald-900 hover:text-emerald-200 hover:border-emerald-500 transition-all rounded-lg text-xs font-semibold">Jump to Day 15</button>
              <button onClick={() => enableDebugDay(30)} className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-purple-900 hover:text-purple-200 hover:border-purple-500 transition-all rounded-lg text-xs font-semibold">View Day 30</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800 pb-8 pt-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-indigo-100 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                Day {currentDay}
              </h1>
              {streak > 0 && progressPercent >= 80 && (
                <motion.div 
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 text-xs font-bold bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                >
                  <Award className="w-3.5 h-3.5" /> High Exec Streak: {streak}
                </motion.div>
              )}
            </div>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              {format(new Date(2026, 3, currentDay), 'EEEE, MMMM do, yyyy')} — Phase: {getDifficulty(currentDay - 1).toUpperCase()}
            </p>
          </motion.div>
          
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full md:w-64 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/70 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-2 text-sm">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Daily Execution</span>
              <span className="font-extrabold text-indigo-400">{completedCount} / 6</span>
            </div>
            <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-zinc-800 box-content">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] animate-[shimmer_2s_infinite]" style={{backgroundSize:'200% 100%'}}/>
              </motion.div>
            </div>
          </motion.div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {CATEGORIES.map((cat, idx) => {
              const task = tasks.find(t => t.category === cat.key);
              if (!task) return null;

              return (
                <motion.div 
                  key={cat.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group flex flex-col bg-[#0a0a0c] border rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl relative overflow-hidden",
                    task.completed ? "border-zinc-800/60 bg-[#08080a]" : cn(cat.border, "shadow-lg bg-gradient-to-b from-[#0e0e11] to-[#0a0a0c]")
                  )}
                >
                  {/* Glass highlight effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl transition-colors", task.completed ? "bg-zinc-900 text-zinc-600" : cn(cat.bg, cat.color))}>
                        <cat.icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <h2 className={cn("text-lg font-black tracking-tight", task.completed ? "text-zinc-600" : "text-zinc-100")}>{cat.key}</h2>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border",
                      task.completed ? "border-zinc-800 text-zinc-600" : "border-zinc-700/50 text-zinc-400 bg-zinc-900/50"
                    )}>
                      {task.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-start gap-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                      <button 
                        className={cn(
                          "mt-0.5 flex-shrink-0 transition-all duration-300 transform active:scale-75 focus:outline-none",
                          task.completed ? cat.color : "text-zinc-600 hover:text-zinc-400"
                        )}
                      >
                        {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                      </button>
                      <p className={cn(
                        "text-[15px] font-medium leading-relaxed transition-all duration-300",
                        task.completed ? "line-through text-zinc-600" : "text-zinc-200 group-hover:text-white"
                      )}>
                        {task.title}
                      </p>
                    </div>

                    {/* Notes Field */}
                    <AnimatePresence>
                      {!task.completed && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-auto pt-2 overflow-hidden">
                          <textarea
                            placeholder="Execution notes / thoughts..."
                            value={task.notes || ""}
                            onChange={(e) => updateNote(task.id, e.target.value)}
                            className="w-full bg-black/40 border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none transition-all outline-none"
                            rows={2}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* DAY 30 - MASTER SUMMARY VIEW */}
        {currentDay === 30 && masterStats && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-16 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#09090b] relative overflow-hidden rounded-[2.5rem] border border-indigo-500/30 p-1 lg:p-12 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-[#060608] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10 p-6 lg:p-0">
              <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-12">
                <Trophy className="w-16 h-16 text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4">
                  Day 30: The Master Protocol
                </h2>
                <p className="text-zinc-400 text-lg font-medium">Your 30-Day Execution Cycle has concluded. Review your absolute performance metrics below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 text-center shadow-xl">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Output</div>
                  <div className="text-5xl font-black text-white mb-2">{masterStats.totalCompleted}/{masterStats.totalAssigned}</div>
                  <div className="text-zinc-400 text-sm">Tasks Executed</div>
                </div>

                <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 text-center shadow-xl flex flex-col justify-center">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Completion Rate</div>
                  <div className={cn("text-6xl font-black mb-1", masterStats.pct >= 85 ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]" : masterStats.pct >= 60 ? "text-yellow-400" : "text-red-500")}>
                    {masterStats.pct}%
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center text-left shadow-xl space-y-4">
                  <div>
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Strongest Area</div>
                    <div className="text-xl font-black text-green-400">{masterStats.maxCat}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Weakest Area</div>
                    <div className="text-xl font-black text-red-400">{masterStats.minCat}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 max-w-2xl mx-auto backdrop-blur-md">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 text-center">System Feedback</div>
                <div className={cn(
                  "text-2xl font-black text-center tracking-tight",
                  masterStats.pct >= 85 ? "text-white" : masterStats.pct >= 60 ? "text-zinc-300" : "text-zinc-400"
                )}>
                  "{masterStats.feedback}"
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Developer Override Toolbar for quickly exploring days without manual date changing */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-3 h-14 flex items-center justify-center gap-2 overflow-x-auto z-50 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest absolute left-4 hidden md:block">Time Traversal Active</span>
          {[...Array(30)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => enableDebugDay(i + 1)} 
              className={cn(
                "w-8 h-8 rounded shrink-0 text-xs font-bold transition-all",
                currentDay === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
