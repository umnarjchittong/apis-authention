import { CheckCircle2, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";
import { toastCopySuccess } from "../services/SweetAlert";

export default function TokenSuccessModal({ isOpen, onClose, token }) {
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
                        className="relative glass-panel p-margin rounded-xl max-w-xl w-full text-center border-2 border-primary shadow-[0_0_50px_rgba(0,209,255,0.2)]"
                    >
                        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-on-surface mb-2">
                            Token Generated
                        </h2>
                        <p className="text-on-surface-variant mb-3">
                            รหัสโทเค็นโครงการเฉพาะของคุณ,ได้รับการกำหนดไว้อย่างปลอดภัยแล้ว.
                        </p>

                        <>
                            <div className="w-full flex justify-end mb-2">
                                <CopyToClipboard
                                    text={token}
                                    onCopy={() => {
                                        toastCopySuccess({
                                            title: "Copied to clipboard",
                                            icon: "success",
                                        });
                                        this.setState({ copied: true });
                                    }}
                                >
                                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                                    <div className="flex items-center gap-2 cursor-pointer text-sm font-normal"><Copy
                                        title="Copy to clipboard"
                                        className="w-8 h-8 text-tertiary p-1.5 cursor-pointer"
                                    /><span className="text-on-surface-variant">click to copy</span>
                                    </div>
                                </CopyToClipboard>
                            </div>
                            <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant mb-margin font-mono text-primary break-all group relative">
                                <span className="relative z-10">{token}</span>
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                            </div>
                        </>

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
