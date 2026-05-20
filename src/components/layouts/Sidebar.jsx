import { Terminal, Key, FileText, Code, LifeBuoy, Cpu, LogOut, Target } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: Key, label: 'Tokens', active: true },
  { icon: FileText, label: 'Documentation' },
  { icon: Code, label: 'API Reference' },
  { icon: LifeBuoy, label: 'Support' },
];

const bottomItems = [
  { icon: Cpu, label: 'System Status', url: 'https://kuma.mju.ac.th/status/apis', target: '_blank' },
  { icon: LogOut, label: 'Log Out', url: './logout', target: '_self', danger: true },
];

export default function Sidebar() {
  return (
    <aside className="bg-surface-container-lowest fixed left-0 top-0 h-full w-60 z-40 border-r border-outline-variant/20 hidden md:flex flex-col pt-20 pb-margin justify-between">
      <div className="flex flex-col">
        <div className="px-gutter mb-margin">
          <div className="flex items-center gap-base mb-2">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">Core Engine</p>
              <p className="text-[10px] text-tertiary font-mono">v2.4.0-stable</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col">
          {navItems.map((item) => (
            <a
              key={item.label}
              className={`flex items-center gap-base px-gutter py-3 cursor-pointer transition-all duration-200 border-l-4 ${
                item.active 
                  ? 'text-primary bg-primary/5 border-primary font-bold' 
                  : 'text-on-surface-variant border-transparent hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-base border-t border-outline-variant/10 pt-base">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            className={`flex items-center gap-base px-gutter py-3 cursor-pointer transition-all duration-200 group ${
              item.danger ? 'text-on-surface-variant hover:text-error' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            href={item.url}
            target={item.target}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
