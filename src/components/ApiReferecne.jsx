import { Copy, ChevronRight, Database, Globe, Lock, Clock } from "lucide-react";
import { motion } from "motion/react";

const endpoints = [
    {
        method: "GET",
        path: "/v1/tokens",
        description: "List all active tokens for the authenticated user.",
        auth: "Required",
    },
    {
        method: "POST",
        path: "/v1/tokens/generate",
        description:
            "Generate a new secure API token with specified permissions.",
        auth: "Required",
    },
    {
        method: "DELETE",
        path: "/v1/tokens/{id}",
        description: "Instantly revoke and destroy an existing token.",
        auth: "Required",
    },
    {
        method: "GET",
        path: "/v1/usage",
        description: "Retrieve real-time usage metrics and rate limit status.",
        auth: "Required",
    },
];

const codeExample = `// Request Example
curl -X POST https://api.nexusapi.com/v1/tokens/generate \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production Server",
    "scopes": ["read", "write"]
  }'

// Response Example (200 OK)
{
  "status": "success",
  "data": {
    "token": "nx_live_83k92m1_v92m...",
    "created_at": "2024-05-19T08:24Z",
    "expires_at": null
  }
}`;

export default function ApiReference() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-on-surface mb-4 tracking-tight">
                    API Reference
                </h1>
                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    The NexusAPI provides a RESTful interface for managing your
                    security tokens and monitoring infrastructure health
                    programmatically.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
                {/* Main Content */}
                <div className="xl:col-span-8 space-y-12">
                    {/* Authentication Section */}
                    <section
                        id="auth"
                        className="glass-panel p-margin rounded-xl border-l-4 border-primary"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">
                                Authentication
                            </h2>
                        </div>
                        <p className="text-on-surface-variant mb-4">
                            NexusAPI uses Bearer tokens to authenticate
                            requests. You can generate these tokens via the
                            dashboard or the tokens endpoint.
                        </p>
                        <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant font-mono text-sm text-primary">
                            Authorization: Bearer &lt;YOUR_API_TOKEN&gt;
                        </div>
                    </section>

                    {/* Endpoints List */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Database className="w-6 h-6 text-tertiary" />
                            Core Endpoints
                        </h2>

                        {endpoints.map((ep, i) => (
                            <div
                                key={i}
                                className="glass-panel p-6 rounded-xl hover:bg-surface-container/100 transition-all group"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                                                ep.method === "GET"
                                                    ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                                                    : ep.method === "POST"
                                                      ? "bg-primary/20 text-primary border border-primary/30"
                                                      : "bg-error/20 text-error border border-error/30"
                                            }`}
                                        >
                                            {ep.method}
                                        </span>
                                        <code className="text-on-surface font-mono font-bold">
                                            {ep.path}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
                                        <span className="flex items-center gap-1">
                                            <Lock className="w-3 h-3" />{" "}
                                            {ep.auth}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> 50ms
                                            avg
                                        </span>
                                    </div>
                                </div>
                                <p className="text-on-surface-variant text-sm">
                                    {ep.description}
                                </p>

                                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-end">
                                    <button className="text-xs font-mono text-primary flex items-center gap-1 hover:underline cursor-pointer">
                                        View Parameters{" "}
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Code Sidebar */}
                <div className="xl:col-span-4 lg:sticky lg:top-24 space-y-gutter">
                    <div className="bg-[#0b0e14] border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">
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
                                https://api.nexusapi.com/v1
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
