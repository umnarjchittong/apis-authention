import {
    ChevronRight,
    Database,
    Search,
    Trash2,
    DatabaseSearch,
    SearchX,
    KeySquare,
    SquarePen,
} from "lucide-react";
import { motion , AnimatePresence} from "motion/react";
import { UseAuth } from "../providers/AuthContext";
import { useState } from "react";
import { confirmationDialog } from "../services/SweetAlert";
import dayjs from "dayjs";

const TokenListsTable = ({ filter, tokens, handleTokenCount, handleDelete, handleViewMore }) => {
    let results = filter
        ? tokens?.filter((token) =>
              token.site_name.toLowerCase().includes(filter.toLowerCase()),
          )
        : tokens;

    handleTokenCount(results.length);
    results = results.slice(0, 20); // Limit to first 20 results for performance

    console.log("Tokens with:", tokens);
    console.log("Filtering tokens with:", filter);
    console.log("Filtered results:", results);
    return (
        <div className="space-y-6">
            {results?.map((site, idx) => (
                <div
                    key={idx}
                    className="glass-panel p-6 rounded-xl hover:bg-surface-container transition-all group"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={`uppercase tracking-wider px-3 py-1 rounded text-xs font-bold font-mono ${
                                    site.site_token_lv === "guest"
                                        ? "bg-primary/20 text-primary border border-primary/30"
                                        : site.site_token_lv === "admin"
                                          ? "bg-error/20 text-error border border-error/30"
                                          : "bg-tertiary/20 text-tertiary border border-tertiary/30"
                                }`}
                            >
                                {site.site_token_lv}
                            </span>
                            <code className="text-on-surface font-mono font-bold">
                                {site.api_endpoint} : {site.api_url}
                            </code>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
                            <span
                                onClick={() => {
                                    console.log(
                                        "Edit token with ID:",
                                        site.site_id,
                                    );
                                    // confirmationDialog({
                                    //     icon: "warning",
                                    //     title: "ต้องการลบ ?",
                                    //     text: `คุณต้องการลบ Token (${site.site_name}) นี้!`,
                                    //     confirmButtonText: "ใช่, ลบเลย!",
                                    //     confirmButtonColor: "#93000a",
                                    //     cancelButtonText: "ยกเลิก",
                                    //     cancelButtonColor: "#859399",
                                    //     resTitle: "ลบแล้ว!",
                                    //     resText: "Token ของคุณถูกลบแล้ว.",
                                    //     resIcon: "success",
                                    //     url: "",
                                    //     onClick: handleDelete,
                                    // });
                                }}
                                className="flex items-center gap-1 p-2 hover:text-tertiary-container rounded transition-colors duration-100 cursor-pointer"
                            >
                                <SquarePen className="w-6 h-6" />
                            </span>
                            <span
                                onClick={() => {
                                    console.log(
                                        "Delete token with ID:",
                                        site.site_id,
                                    );
                                    confirmationDialog({
                                        icon: "warning",
                                        title: "ต้องการลบ ?",
                                        text: `คุณต้องการลบ Token (${site.site_name}) นี้!`,
                                        confirmButtonText: "ใช่, ลบเลย!",
                                        confirmButtonColor: "#93000a",
                                        cancelButtonText: "ยกเลิก",
                                        cancelButtonColor: "#859399",
                                        resTitle: "ลบแล้ว!",
                                        resText: "Token ของคุณถูกลบแล้ว.",
                                        resIcon: "success",
                                        url: "",
                                        onClick: handleDelete,
                                    });
                                }}
                                className="flex items-center gap-1 p-2 hover:text-error rounded transition-colors duration-100 cursor-pointer"
                            >
                                <Trash2 className="w-6 h-6" />
                            </span>
                        </div>
                    </div>
                    <p className="text-on-surface-variant text-base mb-2">
                        Project: {site.site_name}
                    </p>
                    <p className="text-on-surface-variant font-normal text-sm">
                        URL: {site.site_url}
                    </p>

                    <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-end">
                        <button
                        onClick={()=> handleViewMore(site)}
                        className="text-xs font-mono text-primary flex items-center gap-1 hover:underline cursor-pointer">
                            View More <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function TokenLists() {
    const formData = new FormData();
    const [keyFilter, setKeyFilter] = useState("");
    const { memberInfo, reloadMemberInfo } = UseAuth();
    const [tokenCount, setTokenCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tokenInfo, setTokenInfo] = useState(null);

    const handleKeyFilterChange = (e) => {
        e.preventDefault();
        console.log("Filter input changed:", e.target.value);
        formData.set("keyFilter", e.target.value);
        setKeyFilter(e.target.value);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-on-surface mb-4 tracking-tight">
                    APIs Tokens Management
                </h1>
                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    รายการโทเค็น API ทั้งหมดของคุณที่สร้างขึ้นสำหรับการเข้าถึง
                    API ของเราอย่างปลอดภัยและมีประสิทธิภาพ.
                    จัดการโทเค็นของคุณได้อย่างง่ายดายที่นี่.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-gutter">
                {/* Main Content */}
                <div className="space-y-12">
                    {/* Authentication Section */}
                    <section
                        id="auth"
                        className="glass-panel p-margin rounded-xl border-l-4 border-primary"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Search className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">
                                ค้นหาโทเค็นของคุณ
                            </h2>
                        </div>
                        <p className="text-on-surface-variant mb-4">
                            ค้นหาโทเค็นของคุณ จากชื่อโปรเจคหรือรายละเอียดอื่น ๆ.
                        </p>
                        {/* <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant font-mono text-sm text-primary">
                         */}
                        <div className="relative">
                            <input
                                id="keyFilterInput"
                                type="text"
                                maxLength={60}
                                placeholder="e.g., student"
                                required
                                onChange={handleKeyFilterChange}
                                defaultValue={keyFilter || ""}
                                className="w-full bg-surface-container-lowest p-4 rounded-lg border border-outline-variant font-mono text-base text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50"
                            />
                            {keyFilter && (
                                <span
                                    onClick={() => {
                                        setKeyFilter("");
                                        document.getElementById(
                                            "keyFilterInput",
                                        ).value = "";
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error cursor-pointer transition-colors duration-100"
                                >
                                    <SearchX className="w-5 h-5" />
                                </span>
                            )}
                        </div>
                        {/* </div> */}
                    </section>

                    {/* Endpoints List */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center justify-between">
                            {keyFilter ? (
                                <span className="flex items-center gap-3 whitespace-nowrap">
                                    <DatabaseSearch className="w-6 h-6 text-secondary" />
                                    Tokens matching "{keyFilter}"
                                </span>
                            ) : (
                                <span className="flex items-center gap-3 whitespace-nowrap">
                                    <Database className="w-6 h-6 text-tertiary" />
                                    Tokens all
                                </span>
                            )}
                            <div className="text-base text-on-surface-variant font-normal">
                                พบ{" "}
                                <span id="tokenCount">
                                    {tokenCount ?? memberInfo?.tokens?.length}
                                </span>{" "}
                                โทเค็น
                            </div>
                        </h2>

                        {memberInfo?.tokens && (
                            <TokenListsTable
                                filter={keyFilter}
                                tokens={memberInfo?.tokens || []}
                                handleTokenCount={(count) =>
                                    setTokenCount(count || 0)
                                }
                                handleViewMore={(site) => {
                                    setTokenInfo(site);
                                    setIsModalOpen(true);
                                }}
                                handleDelete={() => {
                                    // delete token and then reload member info to update the list
                                    reloadMemberInfo();
                                }}
                            />
                        )}
                    </section>
                </div>

                {/* Code Sidebar */}
                {/* <div className="xl:col-span-4 lg:sticky lg:top-24 space-y-gutter">
                    <div className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-surface-container flex items-center justify-between px-4 py-2 border-b border-outline-variant/30">
                            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                                Interactive shell
                            </span>
                            <button className="text-on-surface-variant hover:text-primary transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <pre className="p-6 text-sm font-mono text-primary custom-scrollbar overflow-x-auto">
                            <code>{codeExample}</code>
                        </pre>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-tertiary" />
                            Base URL
                        </h3>
                        <div className="flex items-center gap-2 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                            <code className="text-xs text-on-surface-variant">
                                https://apis.mju.ac.th.com/v1
                            </code>
                        </div>
                    </div>
                </div> */}
            </div>

            <TokenInfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                info={tokenInfo}
                />
        </div>
    );
}

export function TokenInfoModal({ isOpen, onClose, info }) {
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
                        <KeySquare className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-on-surface mb-2">
                            API Token Information
                        </h2>
                        {/* <p className="text-on-surface-variant mb-margin">
                            รหัสโทเค็นโครงการเฉพาะของคุณ,ได้รับการกำหนดไว้อย่างปลอดภัยแล้ว.
                        </p> */}

                        <div className="bg-surface-container-lowest p-4 rounded-lg border text-lg font-light border-outline-variant mb-margin text-primary break-all group relative">
                            <span className="relative z-10">
                                {/* {JSON.stringify(info, null, 2)} */}
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        Project Name:{" "}
                                    </span>
                                    {info?.site_name}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        Project URL:{" "}
                                    </span>
                                    {info?.site_url}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        TOKEN:{" "}
                                    </span>
                                    {info?.site_token}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        Endpoint:{" "}
                                    </span>
                                    {info?.api_endpoint}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        Endpoint URL:{" "}
                                    </span>
                                    {info?.api_url}
                                </p>
                                <p className="text-left text-wrap">
                                    <span className="font-bold text-tertiary">
                                        Lastupdate:{" "}
                                    </span>
                                    {info?.site_update_at ? dayjs(info?.site_update_at).format("YYYY-MM-DD HH:mm:ss") : dayjs(info.create_at).format("YYYY-MM-DD HH:mm:ss")}
                                </p>
                            </span>
                            <div className="absolute inset-0 bg-primary/5 opacity-60 group-hover:opacity-0 transition-opacity rounded-lg"></div>
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
