import {
    Shield,
    Lock,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    Clock,
    SearchX,
    ScrollText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UseAuth } from "../providers/AuthContext";
import createLog from "../services/Logs";
import { useEffect, useState } from "react";

const logsPerPage = 20;

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

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now - time) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return time.toLocaleDateString();
};

export default function SecurityLogs() {
    const { securityLogs, memberInfo } = UseAuth();
    const [filterResult, setFilterResult] = useState(securityLogs);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(
        () => Math.ceil(securityLogs?.length / logsPerPage) || 1,
    );
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logInfo, setLogInfo] = useState(null);

    const handleSearchReset = () => {
        setSearchQuery("");
        setFilterResult(securityLogs);
        setPage(1);
        setTotalPages(Math.ceil(securityLogs?.length / logsPerPage) || 1);
        document.getElementById("keyFilterInput").value = "";
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        // console.log("Search query:", query);
        const filtered = securityLogs?.filter((log) => {
            const matchesEvent = log.title?.toLowerCase().includes(query);
            const matchesUser = log?.user?.toLowerCase().includes(query);
            const matchesMethod = log?.method?.toLowerCase().includes(query);
            const matchesStatus = log?.status?.toLowerCase().includes(query);
            return (
                matchesEvent || matchesUser || matchesMethod || matchesStatus
            );
        });
        setFilterResult(filtered);
        setPage(1);
        setTotalPages(Math.ceil(filtered.length / logsPerPage));
    };
    // const totalPages = Math.ceil(filterResult.length / logsPerPage);

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
                {filterResult?.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-xl">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                            <input
                                id="keyFilterInput"
                                type="text"
                                onChange={handleSearchChange}
                                defaultValue={searchQuery}
                                placeholder="Search by Event, User, Method or Status type..."
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            />
                            {searchQuery && (
                                <span
                                    onClick={handleSearchReset}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error cursor-pointer transition-colors duration-100"
                                >
                                    <SearchX className="w-5 h-5" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-sm font-bold border border-outline-variant/30 hover:bg-surface-bright transition-colors cursor-pointer">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer ml-auto">
                                Export CSV <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    createLog({
                                        title: "Test Create Log",
                                        method: "post",
                                        status: "success",
                                        detail: "This is a test log entry created from the Security Logs page.",
                                        meta: JSON.stringify({ test: true }),
                                        user: memberInfo?.email || "unknown",
                                    });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg text-sm font-bold border border-error/20 hover:bg-error/20 transition-colors cursor-pointer ml-auto"
                            >
                                Test Log <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Logs Table */}
                <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">
                                    <th className="px-6 py-4 hidden md:table-cell">
                                        create_at
                                    </th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4 hidden xl:table-cell">
                                        User / Details
                                    </th>
                                    {/* <th className="px-6 py-4">Method</th> */}
                                    <th className="px-6 py-4">
                                        Method / Status
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {filterResult
                                    ?.slice(
                                        (page - 1) * logsPerPage,
                                        page * logsPerPage,
                                    )
                                    ?.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-primary/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                                                    <Clock className="w-3 h-3" />
                                                    {getTimeAgo(log.create_at)}
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
                                                        className={`text-sm font-semibold ${log.method === "delete" ? "text-error" : "text-on-surface"}`}
                                                    >
                                                        {log.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden xl:table-cell">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium flex items-center gap-1">
                                                        <Lock className="w-3 h-3 text-on-surface-variant" />
                                                        {log.user}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-outline text-wrap">
                                                        {log.detail.slice(
                                                            0,
                                                            60,
                                                        )}
                                                        ...
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex flex-col items-center gap-1">
                                                <div
                                                    className={`text-sm font-mono font-bold uppercase ${log.method === "delete" ? "text-error-container" : log.method === "post" ? "text-primary-container" : log.method === "patch" ? "text-secondary-container" : log.method === "get" ? "text-tertiary-container" : "text-on-surface"}`}
                                                >
                                                    {log.method.toUpperCase()}
                                                </div>
                                                <div
                                                    className={`inline-flex w-fit items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                        log.status === "success"
                                                            ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                                                            : log.status ===
                                                                "error"
                                                              ? "bg-secondary/10 text-secondary border-secondary/20"
                                                              : "bg-error/10 text-error border-error/20"
                                                    }`}
                                                >
                                                    {log.status ===
                                                        "success" && (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    )}
                                                    <span className="pt-0.5">
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setLogInfo(log);
                                                        setIsModalOpen(true);
                                                        // console.log("Log info:", log);
                                                    }}
                                                    className="text-[10px] font-mono font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    more...
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-surface-container flex items-center justify-between text-xs text-on-surface-variant font-mono border-t border-outline-variant/30">
                        <span>
                            Showing {(page - 1) * logsPerPage + 1}-
                            {Math.min(
                                page * logsPerPage,
                                filterResult?.length || 0,
                            )}{" "}
                            of {filterResult?.length || 0} immutable records
                        </span>
                        {totalPages > 1 && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage(page - 1);
                                        }
                                    }}
                                    className="hover:text-primary transition-colors cursor-pointer"
                                >
                                    PREV
                                </button>
                                page {page} of {totalPages}
                                <button
                                    onClick={() => {
                                        if (page < totalPages) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    className="hover:text-primary transition-colors cursor-pointer"
                                >
                                    NEXT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LogInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    // setLogInfo(null);
                }}
                logInfo={logInfo}
            />
        </div>
    );
}

export function LogInfoModal({ isOpen, onClose, logInfo }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-surface/90 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative glass-panel p-margin rounded-xl max-w-3xl w-full text-center border-2 border-primary shadow-[0_0_50px_rgba(0,209,255,0.2)]"
                    >
                        <ScrollText className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-on-surface mb-2">
                            Log Details
                        </h2>
                        {/* <p className="text-on-surface-variant mb-margin">
                            รหัสโทเค็นโครงการเฉพาะของคุณ,ได้รับการกำหนดไว้อย่างปลอดภัยแล้ว.
                        </p> */}

                        <div className="bg-surface-container-lowest p-4 rounded-lg border text-lg font-mono border-outline-variant mb-margin text-primary break-all group relative">
                            <span className="relative z-10">
                                {/* {JSON.stringify(logInfo, null, 2)} */}
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Log ID:{" "}
                                    </span>
                                    {logInfo?.id}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Event:{" "}
                                    </span>
                                    {logInfo?.title}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Method:{" "}
                                    </span>
                                    {logInfo?.method}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Status:{" "}
                                    </span>
                                    {logInfo?.status}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Detail:{" "}
                                    </span>
                                    {logInfo?.detail}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Meta:{" "}
                                    </span>
                                    {logInfo?.meta}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        User:{" "}
                                    </span>
                                    {logInfo?.user}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-primary">
                                        Timestamp:{" "}
                                    </span>
                                    {new Date(
                                        logInfo?.create_at,
                                    ).toLocaleString()}
                                </p>
                            </span>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-margin py-3 bg-primary-container text-on-primary-container font-bold rounded-lg w-full transition-transform active:scale-95 cursor-pointer"
                        >
                            ตกลง
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
