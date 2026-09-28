import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, Gauge, Briefcase, Map, Mic, ArrowRight } from "lucide-react";

const STAGES = [
  { icon: FileText, label: "Upload resume" },
  { icon: Gauge, label: "Get ATS score" },
  { icon: Briefcase, label: "Match to jobs" },
  { icon: Map, label: "Close skill gaps" },
  { icon: Mic, label: "Practice interviews" },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "ATS score, explained",
    description: "A weighted breakdown of keyword match, formatting, skills, experience, and education — not just a number.",
  },
  {
    icon: Briefcase,
    title: "Resume-to-job matching",
    description: "See exactly which skills you're missing for a role, and which ones already put you ahead.",
  },
  {
    icon: Mic,
    title: "AI mock interviews",
    description: "Role-specific questions, answer-by-answer feedback, and a scored summary when you're done.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex-1">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-brass mb-5"
        >
          Bearing: 000° → Career
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl sm:text-6xl text-parchment leading-[1.1] mb-6"
        >
          Plot your course from
          <br />
          <span className="italic text-brass">resume</span> to <span className="italic text-verdigris-soft">offer</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-parchment-dim text-lg max-w-xl mx-auto mb-10"
        >
          Career Compass AI scores your resume, closes your skill gaps, and rehearses
          your interview — all in one instrument panel.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-brass text-ink font-medium px-6 py-3 rounded-lg hover:bg-brass-soft transition-colors"
          >
            Get started free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-parchment-dim hover:text-parchment font-medium px-6 py-3 transition-colors"
          >
            Sign in
          </Link>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="panel rounded-2xl p-8 overflow-x-auto">
          <div className="flex items-center min-w-140 justify-between">
            {STAGES.map((stage, i) => (
              <div key={stage.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-ink border border-ink-line flex items-center justify-center">
                    <stage.icon size={18} className="text-brass-dim" />
                  </div>
                  <span className="text-xs text-parchment-dim text-center max-w-22.5">{stage.label}</span>
                </div>
                {i < STAGES.length - 1 && <div className="h-0 flex-1 mx-1 border-t-2 border-dashed border-ink-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-28 grid sm:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="panel rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center mb-4">
              <feature.icon size={18} className="text-brass" />
            </div>
            <h3 className="font-display text-lg text-parchment mb-2">{feature.title}</h3>
            <p className="text-sm text-parchment-dim leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}