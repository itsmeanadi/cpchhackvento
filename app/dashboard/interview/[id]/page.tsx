import { auth } from "@/auth";
import { getJobById } from "@/lib/jobs";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InterviewChat } from "@/components/interview-chat";

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-400 mb-2">Interview not found</p>
                    <Link href="/dashboard" className="text-indigo-500 font-medium hover:text-indigo-400">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    // Mock skills if not present in job object
    const jobWithSkills = {
        ...job,
        skills: ["Data Structures", "Algorithms", "Problem Solving", "Core CS Subjects"]
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            <Navbar user={session.user} />

            <main className="max-w-5xl mx-auto px-6 py-6 h-[calc(100vh-64px)]">
                <Link href={`/dashboard/apply/${id}`} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={16} /> End Interview
                </Link>

                <InterviewChat job={jobWithSkills} />
            </main>
        </div>
    );
}
