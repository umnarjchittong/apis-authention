import { motion } from "motion/react";
import { UseAuth } from "../providers/AuthContext";

export default function SidebarWidgets() {
  const { responseTime } = UseAuth();
    return (
        <aside className="flex flex-col gap-gutter">
            <WidgetEndpointSkeleton
                title={"Endpoint Status"}
                accent={"tertiary"}
            >
                <div className="space-y-base">
                    <div className="flex justify-between items-center text-sm font-mono">
                        <span className="text-on-surface-variant">
                            Core APIs
                        </span>
                        <span className="flex items-center gap-1">
                            <span
                                className={`w-2 h-2 rounded-full bg-tertiary animate-pulse`}
                            ></span>
                            {responseTime?.apis || "N/A"}ms
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-mono">
                        <span className="text-on-surface-variant">
                            APIs Sandbox
                        </span>
                        <span className="flex items-center gap-1">
                            <span
                                className={`w-2 h-2 rounded-full bg-tertiary animate-pulse`}
                            ></span>
                            {responseTime?.sandbox || "N/A"}ms
                        </span>
                    </div>
                </div>
            </WidgetEndpointSkeleton>

            <WidgetInsightsSkeleton>
                <h3 className="text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface mb-2">
                    Usage Insights
                </h3>
                <p className="text-[12px] text-on-surface-variant mb-4">
                    Application tokens เพียงพอสำหรับการใช้งานในระดับพื้นฐาน. เพื่อเรียกใช้ข้อมูลจาก Data Center ของมหาวิทยาลัยได้สำหรับสรุปข้อมูล หรือสร้างแดชบอร์ดอย่างมืออาชีพ.
                </p>
                <div className="w-full h-24 bg-surface-container-lowest rounded-lg overflow-hidden relative border border-outline-variant/30 flex items-end justify-between px-2 pb-1">
                    {[30, 45, 35, 70, 50, 85, 40].map((height, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className={`w-2 bg-primary/40 rounded-t-sm`}
                            style={{ filter: `opacity(${0.2 + height / 100})` }}
                        />
                    ))}
                </div>
            </WidgetInsightsSkeleton>

            <WidgetImageSkeleton>
                <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXVn6TOMSzSmpstmYi9u0sxWLXjLLPMgi0vtKa_pNP1gSCki9fH8frIyfoCeh5Jp7qPLfVEI9uEFrrreTVAYZ5TLjDbvfC1x2lKRndLAmwN5xZRH_ediTo1UQMh6l6yLZzCedFflG1TcdokVGX1vKbWFQlAoEB_UmG69y0Q1DKqL7bElNGHMZn41UJkGLljyFPykf1C89usteXHp4tCJ8h3LZg1Ddagot51XgAx_kBUPl5Q7XxBF6Tj8i80Y91MFs4YYPqlQMFa10"
                    alt="Cluster Status"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent opacity-80"></div>
                <div className="absolute bottom-base left-base">
                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded border border-primary/30 font-mono">
                        GLOBAL CLUSTER
                    </span>
                </div>
            </WidgetImageSkeleton>
        </aside>
    );
}

export function WidgetEndpointSkeleton({
    title = "Endpoint Status",
    accent = "tertiary",
    children,
}) {
    return (
        <div
            className={`glass-panel p-gutter rounded-xl border-l-4 border-${accent}`}
        >
            <h3
                className={`text-[12px] font-mono font-semibold uppercase tracking-wider text-${accent} mb-2`}
            >
                {title}
            </h3>
            {children}
        </div>
    );
}

export function WidgetInsightsSkeleton({ children }) {
    return <div className="glass-panel p-gutter rounded-xl">{children}</div>;
}

export function WidgetImageSkeleton({ children }) {
    return (
        <div className="relative rounded-xl overflow-hidden aspect-video group">
            {children}
        </div>
    );
}
