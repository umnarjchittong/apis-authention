import { Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegistrationForm({ onGenerate }) {
  return (
    <section className="lg:col-span-2 glass-panel p-margin rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-tertiary to-primary opacity-50"></div>
      
      <form className="space-y-gutter">
        <div className="group">
          <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
            Website Name
          </label>
          <div className="relative">
            <input 
              type="text"
              placeholder="e.g., My Awesome Project"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-mono text-sm"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
            Website URL
          </label>
          <div className="relative">
            <input 
              type="url"
              placeholder="e.g., https://example.com"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-mono text-sm"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
            Token Level
          </label>
          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none font-mono text-sm">
            <option>Read-only (Basic)</option>
            <option>Read/Write (Standard)</option>
            <option>Full Admin (Enterprise)</option>
          </select>
        </div>

        <div className="pt-base">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.preventDefault(); onGenerate(); }}
            className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-lg flex items-center justify-center gap-base neon-glow-primary transition-all cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-current" />
            Generate Token
          </motion.button>
        </div>

        <footer className="pt-margin border-t border-outline-variant/20">
          <div className="flex items-start gap-base text-on-surface-variant">
            <ShieldCheck className="w-5 h-5 text-tertiary shrink-0" />
            <p className="text-[12px] leading-relaxed">
              <span className="font-bold text-on-surface">Security & Rate Limits:</span> Tokens are encrypted at rest. Rate limiting is applied based on your tier (Basic: 100 req/min). Ensure your token is stored in a secure server-side environment.
            </p>
          </div>
        </footer>
      </form>
    </section>
  );
}
