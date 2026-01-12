"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PlacementStats } from "@/lib/analytics";

export function DashboardCharts({ stats }: { stats: PlacementStats }) {

    // Data for Pie Chart (Placement Rate)
    const placementData = [
        { name: "Placed", value: stats.placedStudents, color: "#10b981" }, // Emerald-500
        { name: "Unplaced", value: stats.unplacedStudents, color: "#e5e7eb" }, // Gray-200
    ];

    // Data for Bar Chart (Branch-wise)
    // Filter out unknown or empty branches if needed, or keeping them is fine
    const branchData = stats.branchDistribution.map(b => ({
        name: b.branch,
        Placed: b.placed,
        Total: b.total,
        Unplaced: b.total - b.placed
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Deployment Status Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Placement Status</h3>
                        <p className="text-sm text-gray-500">Overall placement progress</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-600">{stats.placementRate}%</span>
                        <p className="text-xs text-gray-500">Placed</p>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={placementData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {placementData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Branch Wise Stats Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Branch-wise Performance</h3>
                <p className="text-sm text-gray-500 mb-6">Placements across departments</p>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={branchData}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend />
                            <Bar dataKey="Placed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Total" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
