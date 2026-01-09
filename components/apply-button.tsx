"use client";

import Link from "next/link";

interface ApplyButtonProps {
    jobId: string;
}

export function ApplyButton({ jobId }: ApplyButtonProps) {
    return (
        <Link
            href={`/dashboard/apply/${jobId}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
        >
            Apply Now
        </Link>
    );
}
