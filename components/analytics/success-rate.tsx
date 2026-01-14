"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight } from "lucide-react";

interface SuccessRateProps {
    applicationCount: number;
    interviewCount: number;
}

export function SuccessRate({ applicationCount, interviewCount }: SuccessRateProps) {
    const data = [
        { name: "Applications", value: applicationCount - interviewCount, color: "#374151" }, // Gray
        { name: "Interviews", value: interviewCount, color: "#10B981" }, // Emerald
    ];

    if (applicationCount === 0) {
        return (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[300px]">
                <p className="text-neutral-500 mb-2">No applications yet</p>
                <div className="w-32 h-32 rounded-full border-4 border-neutral-800 border-dashed animate-spin-slow"></div>
            </div>
        );
    }

    const conversionRate = Math.round((interviewCount / applicationCount) * 100);

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-semibold text-white">Application Success Rate</h3>
                    <p className="text-sm text-neutral-400">Conversion from Apply to Interview</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <ArrowUpRight size={14} />
                    {conversionRate}%
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                            itemStyle={{ color: "#e5e5e5" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-6">
                    <p className="text-3xl font-bold text-white">{interviewCount}</p>
                    <p className="text-xs text-neutral-500">Shortlisted</p>
                </div>
            </div>

            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-neutral-400">Interviews</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    <span className="text-sm text-neutral-400">Applied</span>
                </div>
            </div>
        </div>
    );
}
