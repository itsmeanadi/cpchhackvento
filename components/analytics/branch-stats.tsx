"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const DATA = [
    { name: "Computer Science", value: 85, color: "#3b82f6" },
    { name: "Info Tech", value: 65, color: "#06b6d4" },
    { name: "Electronics", value: 45, color: "#8b5cf6" },
    { name: "Mechanical", value: 30, color: "#f59e0b" },
];

export function BranchStats() {
    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="mb-6">
                <h3 className="font-semibold text-white">Branch-wise Placements</h3>
                <p className="text-sm text-neutral-400">Year-to-date placement stats</p>
            </div>

            <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={DATA}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            labelLine={false}
                        >
                            {DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                            itemStyle={{ color: "#e5e5e5" }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
