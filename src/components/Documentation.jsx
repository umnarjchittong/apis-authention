import { Book, Shield, Zap, Terminal, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'security', label: 'Security Protocols' },
  { id: 'ratelimits', label: 'Rate Limiting' },
];

export default function Documentation() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-on-surface mb-4 tracking-tight">Documentation</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
          Master the NexusAPI ecosystem. Learn how to securely integrate, monitor, and scale your infrastructure with our comprehensive guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Navigation - Hidden on mobile, sticky on desktop */}
        <nav className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 h-fit">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container">
              <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">On this page</span>
            </div>
            <div className="p-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-md transition-all font-mono"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-gutter p-6 glass-panel rounded-xl border-l-4 border-tertiary">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 font-mono text-tertiary">Developer Support</h4>
            <p className="text-xs text-on-surface-variant mb-4">Need help with complex deployments?</p>
            <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer">
              Join Discord Server <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="lg:col-span-9 space-y-16 pb-24">
          <section id="introduction" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Introduction</h2>
            </div>
            <div className="prose prose-invert max-w-none space-y-4 text-on-surface-variant leading-relaxed">
              <p>
                NexusAPI is a high-performance token registration and management platform designed for distributed systems. Whether you're building a simple app or a massive microservices architecture, our tools provide the security and visibility you need.
              </p>
              <p>
                Our core philosophy centers on <strong>zero-trust architecture</strong> and <strong>global scalability</strong>. Every component in NexusAPI is designed to minimize latency while maximizing security throughput.
              </p>
            </div>
          </section>

          <section id="quickstart" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Quick Start</h2>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">1</div>
                  <div>
                    <h3 className="font-bold mb-2">Create an Account</h3>
                    <p className="text-sm text-on-surface-variant">Sign up via the main portal and verify your enterprise domain to unlock full capabilities.</p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">2</div>
                  <div>
                    <h3 className="font-bold mb-2">Register your First Token</h3>
                    <p className="text-sm text-on-surface-variant">Navigate to the <code className="bg-surface-container px-1 rounded">Tokens</code> page and fill out your project details. Your token will be ready instantly.</p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">3</div>
                  <div>
                    <h3 className="font-bold mb-2">Integrate the SDK</h3>
                    <p className="text-sm text-on-surface-variant">Use our official client-side or server-side libraries to start communicating with the global cluster.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-tertiary" />
              <h2 className="text-3xl font-bold">Security Protocols</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container/50 border border-outline-variant/30 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3 text-tertiary">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold">Encryption at Rest</span>
                </div>
                <p className="text-sm text-on-surface-variant">All tokens are salted and hashed using Argon2 with enterprise-grade work factors before being flushed to persistent storage.</p>
              </div>
              <div className="bg-surface-container/50 border border-outline-variant/30 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3 text-tertiary">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold">Mutual TLS (mTLS)</span>
                </div>
                <p className="text-sm text-on-surface-variant">Enterprise clusters support mTLS for all inter-service communication, ensuring identity verification at every layer.</p>
              </div>
            </div>
            
            <div className="mt-8 bg-error/10 border border-error/20 p-6 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-error shrink-0" />
              <div>
                <h4 className="font-bold text-error mb-1">Critical Security Notice</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Never expose your API tokens in client-side code. Always use server-side proxies or edge handlers to secure your environment variables. Compromised tokens should be revoked immediately via the API Reference or Dashboard.
                </p>
              </div>
            </div>
          </section>

          <section id="ratelimits" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Rate Limiting</h2>
            </div>
            <div className="overflow-x-auto glass-panel rounded-xl">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant">
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Tier</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Requests / Min</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Concurrent Connections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr>
                    <td className="px-6 py-4 text-primary">Basic</td>
                    <td className="px-6 py-4">100 req/min</td>
                    <td className="px-6 py-4">10</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-tertiary">Standard</td>
                    <td className="px-6 py-4">5,000 req/min</td>
                    <td className="px-6 py-4">500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-secondary">Enterprise</td>
                    <td className="px-6 py-4">Custom Limits</td>
                    <td className="px-6 py-4">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
