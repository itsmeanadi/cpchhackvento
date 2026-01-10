"use client";

import { updateApplicationStatus } from "@/app/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
    "Applied",
    "Under Review",
    "Interview Scheduled",
    "Selected",
    "Rejected"
];

export function ApplicationStatusDropdown({ applicationId, currentStatus, jobId }: { applicationId: string, currentStatus: string, jobId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus === currentStatus) return;

        setIsLoading(true);
        try {
            await updateApplicationStatus(applicationId, newStatus, jobId);
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block text-left">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                </div>
            )}
            <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isLoading}
                className="block w-full pl-3 pr-8 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
            >
                {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
}
