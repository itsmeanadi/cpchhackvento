"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock data for trends - in a real app, this would be aggregated from all Jobs
const DATA = [
    { name: "React", count: 45 },
    { name: "Python", count: 38 },
    { name: "Java", count: 35 },
    { name: "Node.js", count: 30 },
    { name: "SQL", count: 28 },
];

export function SkillTrends() {
    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="mb-6">
                <h3 className="font-semibold text-white">Skill Demand Trends</h3>
                <p className="text-sm text-neutral-400">Top requested skills in active drives</p>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA} layout="vertical" margin={{ left: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={60}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                            itemStyle={{ color: "#e5e5e5" }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#6366f1"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
