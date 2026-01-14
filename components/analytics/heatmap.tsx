"use client";

// Simple grid heatmap visualization
const DATA = [
    { category: "Super Dream (>20 LPA)", count: 12, color: "bg-purple-500" },
    { category: "Dream (10-20 LPA)", count: 24, color: "bg-blue-500" },
    { category: "Prime (6-10 LPA)", count: 35, color: "bg-emerald-500" },
    { category: "Standard (<6 LPA)", count: 48, color: "bg-slate-600" },
];

export function CompanyHeatmap() {
    const total = DATA.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="mb-6">
                <h3 className="font-semibold text-white">Opportunity Heatmap</h3>
                <p className="text-sm text-neutral-400">Job distribution by package category</p>
            </div>

            <div className="space-y-4">
                {DATA.map((item) => (
                    <div key={item.category}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-300">{item.category}</span>
                            <span className="text-neutral-400">{item.count} Offers</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${(item.count / total) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simulated Heatmap Grid Visual */}
            <div className="mt-6 grid grid-cols-10 gap-1 opacity-60">
                {Array.from({ length: 50 }).map((_, i) => {
                    // Random assignment for visual effect
                    const type = Math.random();
                    let color = "bg-neutral-800";
                    if (type > 0.9) color = "bg-purple-500";
                    else if (type > 0.7) color = "bg-blue-500";
                    else if (type > 0.4) color = "bg-emerald-500";

                    return (
                        <div key={i} className={`aspect-square rounded-sm ${color} transition-opacity hover:opacity-100`}></div>
                    )
                })}
            </div>
        </div>
    );
}
