import {
    Shield,
    Lock,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    Clock,
    MapPin,
} from "lucide-react";
import { motion } from "motion/react";

const logs = [
    {
        id: "1",
        event: "Token Generated",
        actor: "Nexus Developer",
        ip: "192.168.1.45",
        location: "Singapore",
        status: "Success",
        timestamp: "2 mins ago",
        severity: "low",
    },
    {
        id: "2",
        event: "Unauthorized Access Attempt",
        actor: "Unknown",
        ip: "45.12.8.192",
        location: "Moscow, RU",
        status: "Blocked",
        timestamp: "15 mins ago",
        severity: "high",
    },
    {
        id: "3",
        event: "Login Successful",
        actor: "Nexus Developer",
        ip: "192.168.1.45",
        location: "Singapore",
        status: "Success",
        timestamp: "1 hour ago",
        severity: "low",
    },
    {
        id: "4",
        event: "Token Revoked",
        actor: "System Admin",
        ip: "Hidden",
        location: "Cluster-East-1",
        status: "Success",
        timestamp: "3 hours ago",
        severity: "medium",
    },
    {
        id: "5",
        event: "Rate Limit Triggered",
        actor: "Token: nx_live_...2901",
        ip: "203.0.113.10",
        location: "New York, US",
        status: "Throttled",
        timestamp: "5 hours ago",
        severity: "medium",
    },
    {
        id: "6",
        event: "Security Policy Updated",
        actor: "System Admin",
        ip: "Internal",
        location: "Remote",
        status: "Success",
        timestamp: "Yesterday",
        severity: "low",
    },
];

const stats = [
    {
        label: "Active Sessions",
        value: "12",
        trend: "+2",
        color: "text-primary",
    },
    {
        label: "Blocked Threats",
        value: "1,240",
        trend: "+14%",
        color: "text-error",
    },
    {
        label: "Security Score",
        value: "98/100",
        trend: "Stable",
        color: "text-tertiary",
    },
];

export default function SecurityLogs() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-on-surface mb-4 tracking-tight">
                    Security & Governance Logs
                </h1>
                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    Monitor all administrative and automated events within your
                    NexusAPI cluster. Audit trails are immutable and retained
                    for 90 days.
                </p>
            </div>

            <div className="space-y-gutter">
                {/* Security Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="glass-panel p-6 rounded-xl border-l-4 border-primary"
                        >
                            <p className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                                {stat.label}
                            </p>
                            <div className="flex items-baseline gap-3">
                                <span
                                    className={`text-3xl font-bold ${stat.color}`}
                                >
                                    {stat.value}
                                </span>
                                <span className="text-xs text-on-surface-variant font-mono">
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                        <input
                            type="text"
                            placeholder="Search by IP, actor, or event type..."
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-sm font-bold border border-outline-variant/30 hover:bg-surface-bright transition-colors cursor-pointer">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer ml-auto">
                            Export CSV <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">
                                        Actor / System
                                    </th>
                                    <th className="px-6 py-4">Origin Hub</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                                                <Clock className="w-3 h-3" />
                                                {log.timestamp}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {log.severity === "high" ? (
                                                    <AlertCircle className="w-4 h-4 text-error" />
                                                ) : (
                                                    <Shield className="w-4 h-4 text-primary" />
                                                )}
                                                <span
                                                    className={`text-sm font-bold ${log.severity === "high" ? "text-error" : "text-on-surface"}`}
                                                >
                                                    {log.event}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium flex items-center gap-1">
                                                    <Lock className="w-3 h-3 text-on-surface-variant" />
                                                    {log.actor}
                                                </div>
                                                <div className="text-[10px] font-mono text-outline">
                                                    {log.ip}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <MapPin className="w-3 h-3" />
                                                {log.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                                    log.status === "Success"
                                                        ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                                                        : log.status ===
                                                            "Throttled"
                                                          ? "bg-secondary/10 text-secondary border-secondary/20"
                                                          : "bg-error/10 text-error border-error/20"
                                                }`}
                                            >
                                                {log.status === "Success" && (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                )}
                                                {log.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[10px] font-mono font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                                FULL TRACE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-surface-container flex items-center justify-between text-xs text-on-surface-variant font-mono border-t border-outline-variant/30">
                        <span>Showing 1-6 of 2,491 immutable records</span>
                        <div className="flex gap-4">
                            <button className="hover:text-primary transition-colors cursor-pointer">
                                PREV
                            </button>
                            <button className="hover:text-primary transition-colors cursor-pointer">
                                NEXT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
