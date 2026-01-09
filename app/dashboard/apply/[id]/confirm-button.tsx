"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function ConfirmApplicationButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleConfirm = () => {
        setStatus("loading");
        // Simulate network request
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    if (status === "success") {
        return (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-6 py-3 rounded-xl border border-green-500/20 animate-in fade-in zoom-in-95">
                <CheckCircle size={20} />
                <span className="font-bold">Application Submitted Successfully</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleConfirm}
            disabled={status === "loading"}
            className="w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {status === "loading" && <Loader2 size={18} className="animate-spin" />}
            {status === "loading" ? "Submitting..." : "Confirm Application"}
        </button>
    );
}
