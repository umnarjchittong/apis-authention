import { useState, useRef, useEffect } from "react";
import {
    Bell,
    Settings,
    LogOut,
    User,
    Shield,
    AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UseApp } from "../../providers/AppContext";

export default function Header({ activePage, onNavigate }) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef(null);
    const { appTitle } = UseApp();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // In a real app, you might clear tokens here
        window.location.href = "/signout";
    };

    return (
        <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 fixed top-0 z-50 flex justify-between items-center w-full px-margin h-16">
            <div className="flex items-center gap-gutter">
                <span
                    onClick={() => onNavigate("tokens")}
                    className="text-2xl font-bold tracking-tighter text-primary cursor-pointer"
                >
                    {appTitle}-Auth
                </span>
                <nav className="hidden md:flex gap-margin">
                    {[
                        { id: "tokens", label: "Tokens" },
                        { id: "docs", label: "Documentation" },
                        { id: "api", label: "API Reference" },
                        { id: "support", label: "Support" },
                    ].map((item) => (
                        <a
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`text-sm font-medium transition-colors cursor-pointer pb-1 ${
                                activePage === item.id
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-on-surface-variant hover:text-primary"
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-base">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                {/* <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <Settings className="w-5 h-5" />
                </button> */}

                {/* User Account Menu */}
                <div className="ml-2 relative" ref={menuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="relative cursor-pointer group focus:outline-none"
                    >
                        <img
                            alt="Developer Profile"
                            className={`w-8 h-8 rounded-full border border-outline-variant/50 object-cover transition-all ${isUserMenuOpen ? "ring-2 ring-primary border-transparent" : "group-hover:border-primary/50"}`}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpe-U1IsM7n6HnWSZfGEyuVVs9tWNb8afDazBDEVGBrHXCTmTXqDeJlpAwYHHF0A2fp-09h29iW6oap8_Q_X3v_PruqSSdLqt-NOcyOgNODotWG41n3uSeHFkxoht8eyO52Ga8q_LQ-C4bNEFruf7_WyBFcBpncDDE22MiI4XUPxiNshlm8M4hzjAe-uT5UI33usMMxeQ7yGSAmkRcR74CbQuXNqxOk8t4ZNpPmnbnjZ4bIUyHqWeXNtqjPh5YLZw_qGTzSFO9bq8"
                            referrerPolicy="no-referrer"
                        />
                        <div
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary border-2 border-surface rounded-full transition-transform ${isUserMenuOpen ? "scale-0" : "scale-100"}`}
                        ></div>
                    </button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 glass-panel rounded-xl shadow-2xl overflow-hidden py-2 z-100"
                            >
                                <div className="px-4 py-3 border-b border-outline-variant/20 mb-1">
                                    <p className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">
                                        Current User
                                    </p>
                                    <p className="text-sm font-bold truncate">
                                        Nexus Developer
                                    </p>
                                </div>

                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors text-left font-sans cursor-pointer">
                                    <User className="w-4 h-4" /> Account
                                    Settings
                                </button>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        onNavigate("security-logs");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors text-left font-sans cursor-pointer"
                                >
                                    <Shield className="w-4 h-4" /> Security Logs
                                </button>

                                <div className="h-px bg-outline-variant/20 my-1 mx-2"></div>

                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        setShowLogoutConfirm(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors text-left font-sans"
                                >
                                    <LogOut className="w-4 h-4" /> Signed Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-gutter">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface/90 backdrop-blur-md"
                            onClick={() => setShowLogoutConfirm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass-panel p-8 rounded-2xl max-w-sm w-full text-center border border-outline-variant/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
                                <AlertTriangle className="w-8 h-8 text-error" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">
                                Confirm Sign Out
                            </h2>
                            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                                Are you sure you want to terminate your active
                                session in the global cluster? You will need to
                                re-authenticate to access your tokens.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-error text-on-error font-bold rounded-xl transition-all hover:bg-error/90 active:scale-95"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="w-full py-3 bg-surface-container font-bold rounded-xl border border-outline-variant/30 transition-all hover:bg-surface-container-high active:scale-95 text-on-surface-variant"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}
