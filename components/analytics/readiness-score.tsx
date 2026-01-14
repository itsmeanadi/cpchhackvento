"use client";

import { CheckCircle2, Circle, Trophy } from "lucide-react";

interface ReadinessProps {
    userData: any;
    applicationCount: number;
    interviewCount: number;
}

export function ReadinessScore({ userData, applicationCount, interviewCount }: ReadinessProps) {
    const cgpa = parseFloat(userData?.cgpa || "0");
    const skills = userData?.skills?.length || 0;
    const isProfileComplete = userData?.isProfileComplete;

    let score = 0;
    if (isProfileComplete) score += 30;
    if (cgpa >= 7.5) score += 20;
    if (skills >= 4) score += 20;
    if (applicationCount >= 5) score += 15;
    if (interviewCount >= 1) score += 15;

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} />
                    Placement Readiness
                </h3>
                <span className="text-2xl font-bold text-white">{score}/100</span>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-2.5 mb-6">
                <div
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${score}%` }}
                ></div>
            </div>

            <div className="space-y-3">
                <CheckItem label="Profile Completed" checked={!!isProfileComplete} points={30} />
                <CheckItem label="CGPA > 7.5" checked={cgpa >= 7.5} points={20} />
                <CheckItem label="4+ Skills Added" checked={skills >= 4} points={20} />
                <CheckItem label="5+ Applications" checked={applicationCount >= 5} points={15} />
                <CheckItem label="1+ Interviews" checked={interviewCount >= 1} points={15} />
            </div>
        </div>
    );
}

function CheckItem({ label, checked, points }: { label: string, checked: boolean, points: number }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
                {checked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} />}
                <span className={checked ? "text-neutral-200" : ""}>{label}</span>
            </div>
            <span className="text-xs text-neutral-500">+{points} pts</span>
        </div>
    );
}
