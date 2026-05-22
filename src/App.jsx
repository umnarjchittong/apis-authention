import { useState, useEffect } from "react";
import Header from "./components/layouts/Header";
import Sidebar from "./components/layouts/Sidebar";
import RegistrationForm from "./components/forms/RegistrationForm";
import SidebarWidgets from "./components/SidebarWidgets";
import TokenSuccessModal from "./components/TokenSuccessModal";
import ApiReference from "./components/ApiReferecne";
import Documentation from "./components/Documentation";
import Support from "./components/Support";
import SecurityLogs from "./components/SecurityLogs";
import { UseApp } from "./providers/AppContext";
import { UseAuth } from "./providers/AuthContext";
import TokenLists from "./components/TokenLists";

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activePage, setActivePage } = UseApp();
    const { endpointStatus, responseTime, tokenCreated, tokenCreatedClear, apiEndpoints, reloadApiEndpoints, reloadMemberInfo } =
        UseAuth();

    if (responseTime?.apis === undefined || responseTime?.sandbox === undefined) {
        endpointStatus && endpointStatus("apis", "https://apis.mju.ac.th");
        endpointStatus && endpointStatus("sandbox", "https://apissandbox.mju.ac.th");
    }

    const handleSetActivePage = (page) => {
        setActivePage(page);
        if (page === "tokens") {
            reloadMemberInfo();
            window.location.reload();
        } else if (page === "security-logs") window.location.reload();
    }

    useEffect(() => {
        const checkEndpoints = () => {
          if (activePage === "home") {
            endpointStatus && endpointStatus("apis", "https://apis.mju.ac.th");
            endpointStatus && endpointStatus("sandbox", "https://apissandbox.mju.ac.th");
          }
        };

        // checkEndpoints();
        const interval = setInterval(checkEndpoints, 5000);

        // Cleanup interval on unmount or dependency change
        return () => clearInterval(interval);
    }, [endpointStatus, responseTime, activePage]);

    useEffect(() => {
        if (activePage === "home" && !apiEndpoints) {
            reloadApiEndpoints();
        }
    }, [activePage, apiEndpoints, reloadApiEndpoints]);

    return (
        <div className="min-h-screen bg-surface">
            <Header activePage={activePage} onNavigate={handleSetActivePage} />
            <Sidebar activePage={activePage} onNavigate={handleSetActivePage} />

            <main className="md:pl-60 pt-16 min-h-screen shadow-2xl">
                <div className="max-w-6xl mx-auto px-margin py-12">
                    {activePage === "home" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Heading Section */}
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold text-on-surface mb-2 tracking-tight">
                                    ลงทะเบียนรับสิทธิ์เข้าถึง APIs
                                </h1>
                                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                                    สร้างโทเค็นโครงการเฉพาะของคุณเพื่อเข้าถึง
                                    API ของเราอย่างปลอดภัยและมีประสิทธิภาพ
                                    กรอกรายละเอียดด้านล่างเพื่อสร้างโทเค็น API
                                    ที่ปลอดภัยของคุณ.
                                </p>
                            </div>

                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
                                <RegistrationForm
                                    onGenerate={() => setIsModalOpen(true)}
                                />
                                <SidebarWidgets />
                            </div>
                        </div>
                    )}

                    {activePage === "tokens" && <TokenLists />}
                    {activePage === "api-reference" && <ApiReference />}
                    {activePage === "documentation" && <Documentation />}
                    {activePage === "support" && <Support />}
                    {activePage === "security-logs" && <SecurityLogs />}

                    {["status", "logout"].includes(activePage) && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">
                                Module Under Development
                            </h2>
                            <p className="text-on-surface-variant">
                                The {activePage} module is being provisioned in
                                the global cluster.
                            </p>
                            <button
                                onClick={() => setActivePage("tokens")}
                                className="mt-8 text-primary hover:underline font-mono text-sm"
                            >
                                &lt; Return to Tokens
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <TokenSuccessModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    tokenCreatedClear();
                }}
                token={tokenCreated}
            />
        </div>
    );
}
