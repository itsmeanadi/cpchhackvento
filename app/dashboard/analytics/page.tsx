import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { Navbar } from "@/components/navbar";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { ReadinessScore } from "@/components/analytics/readiness-score";
import { SuccessRate } from "@/components/analytics/success-rate";
import { SkillTrends } from "@/components/analytics/skill-trends";
import { CompanyHeatmap } from "@/components/analytics/heatmap";
import { BranchStats } from "@/components/analytics/branch-stats";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "student") {
        redirect("/login");
    }

    const adminDb = getAdminDb();

    // Fetch User Data
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    let userData = userDoc.data();

    if (userData) {
        userData = {
            ...userData,
            createdAt: userData.createdAt?.toDate?.().toISOString() || null,
            updatedAt: userData.updatedAt?.toDate?.().toISOString() || null,
        } as any;
    }

    // Fetch Application Count
    const appliedJobIds = userData?.appliedJobIds || [];

    // Fetch Interview Count
    const interviewsSnap = await adminDb
        .collection("interviews")
        .where("studentEmail", "==", session.user.email)
        .get();
    const interviewCount = interviewsSnap.size;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            <Navbar user={session.user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors mb-4">
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Performance Analytics</h1>
                            <p className="text-neutral-400 text-sm">Insights into your placement journey</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Stats */}
                    <div className="space-y-6">
                        <ReadinessScore
                            userData={userData}
                            applicationCount={appliedJobIds.length}
                            interviewCount={interviewCount}
                        />
                        <SuccessRate
                            applicationCount={appliedJobIds.length}
                            interviewCount={interviewCount}
                        />
                    </div>

                    {/* Middle & Right Columns - Market Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkillTrends />
                            <BranchStats />
                        </div>
                        <CompanyHeatmap />
                    </div>
                </div>
            </main>
        </div>
    );
}
