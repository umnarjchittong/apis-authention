import {
    Search,
    MessageSquare,
    LifeBuoy,
    FileText,
    Settings,
    Users,
    ArrowRight,
    // Github,
    Send,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
    {
        icon: LifeBuoy,
        label: "Technical Issues",
        description: "API integration, SDK bugs, and platform stability.",
        color: "text-primary",
    },
    {
        icon: Settings,
        label: "Account & Billing",
        description: "Manage your enterprise tier, invoices, and limits.",
        color: "text-tertiary",
    },
    {
        icon: FileText,
        label: "Custom Quotas",
        description: "Request increased rate limits for specific clusters.",
        color: "text-secondary",
    },
    {
        icon: Users,
        label: "Community",
        description: "Join the developer forum and share your projects.",
        color: "text-on-surface",
    },
];

const faqs = [
    {
        q: "How do I secure my token in a frontend app?",
        a: "You should never expose nexus_live tokens in the browser. Use an edge handler or a backend proxy to inject secrets server-side.",
    },
    {
        q: "What happens if I exceed my rate limit?",
        a: "Your requests will return a 429 status code. The standard tier includes automatic burst capacity for 30 seconds.",
    },
    {
        q: "Do you offer enterprise-level SLAs?",
        a: "Yes, our Enterprise tier includes a 99.99% uptime guarantee and 24/7 dedicated engineering support.",
    },
];

export default function Support() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-on-surface mb-4 tracking-tight">
                    Support Engineering
                </h1>
                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    Stuck on an integration? Our engineering team is standing by
                    to help you scale your infrastructure.
                </p>
            </div>

            <div className="space-y-12">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input
                        type="text"
                        placeholder="Search documentation, issues, or ticket status..."
                        className="w-full bg-surface-container border border-outline-variant rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline font-sans"
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-panel p-6 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group"
                        >
                            <cat.icon className={`w-8 h-8 ${cat.color} mb-4`} />
                            <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                                {cat.label}
                            </h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                                {cat.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs font-mono text-primary font-bold">
                                Enter Module <ArrowRight className="w-3 h-3" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    {/* Support Ticket Form */}
                    <div className="lg:col-span-8">
                        <section className="glass-panel p-margin rounded-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">
                                    Submit a Technical Ticket
                                </h2>
                            </div>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                                            Priority
                                        </label>
                                        <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary">
                                            <option>Low (Educational)</option>
                                            <option>Medium (Standard)</option>
                                            <option>
                                                High (Production Down)
                                            </option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                                            Category
                                        </label>
                                        <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary">
                                            <option>API Bug</option>
                                            <option>Cluster Latency</option>
                                            <option>Security/DDoS</option>
                                            <option>Feature Request</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Brief summary of the issue"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Please provide system logs or cluster coordinates if applicable..."
                                    ></textarea>
                                </div>
                                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:neon-glow-primary transition-all active:scale-95">
                                    <Send className="w-4 h-4" />
                                    Dispatch Ticket
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* FAQ & Community Sidebar */}
                    <div className="lg:col-span-4 space-y-gutter">
                        <section className="glass-panel p-6 rounded-xl">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-tertiary" />
                                Common Troubleshooting
                            </h2>
                            <div className="space-y-6">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="text-sm font-bold text-on-surface">
                                            {faq.q}
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-normal">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-surface-container-highest/20 border border-outline-variant/30 p-6 rounded-xl space-y-4">
                            <h3 className="font-bold">
                                Connect with Engineers
                            </h3>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant/30 hover:border-primary transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* <Github className="w-5 h-5" /> */}GH
                                        <span className="text-sm font-mono">
                                            nexus-core-repo
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant/30 hover:border-primary transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-primary">
                                            #
                                        </span>
                                        <span className="text-sm font-mono">
                                            support-escalation
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
