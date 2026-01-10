"use client";

import { applyJob } from "@/app/actions";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function ConfirmApplicationButton({ jobId }: { jobId: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleConfirm = async () => {
        setStatus("loading");

        try {
            // Dynamically import to separate server/client logic if needed or just use simple import
            const result = await applyJob(jobId);

            if (result.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage(result.message || "Failed to apply");
            }
        } catch (error) {
            setStatus("error");
            setMessage("An unexpected error occurred");
        }
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
        <div className="w-full">
            {status === "error" && (
                <div className="mb-3 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center border border-red-500/20">
                    {message}
                </div>
            )}
            <button
                onClick={handleConfirm}
                disabled={status === "loading"}
                className="w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {status === "loading" && <Loader2 size={18} className="animate-spin" />}
                {status === "loading" ? "Submitting..." : "Confirm Application"}
            </button>
        </div>
    );
}
