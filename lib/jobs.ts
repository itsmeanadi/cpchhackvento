import { getAdminDb } from "@/lib/firebase-admin";

export interface Job {
    id: string;
    companyName: string; // Uniform naming
    role: string;
    date: string;
    ctc: string;
    stipend: string;
    cgpa: string | number;
    duration?: string;
    offers?: string;
    status: "active" | "closed";
    documentUrl?: string; // For real uploads
    gradient?: string; // For UI styling
}

export const DEMO_JOBS: Job[] = [
    {
        id: "demo-1",
        companyName: "Barclays",
        role: "Intern",
        date: "27 August 2024",
        ctc: "14 LPA",
        cgpa: "7.5",
        duration: "2 Months",
        stipend: "75,000",
        offers: "11",
        status: "active",
        gradient: "from-blue-600 to-cyan-500"
    },
    {
        id: "demo-2",
        companyName: "PTC",
        role: "C++, Devops, Dev, QA...",
        date: "14 February 2025",
        ctc: "9 LPA",
        cgpa: "7.5",
        duration: "12 Months",
        stipend: "22,000",
        offers: "16",
        status: "active",
        gradient: "from-green-600 to-emerald-500"
    },
    {
        id: "demo-3",
        companyName: "DICE",
        role: "SDE, BA",
        date: "15 February 2025",
        ctc: "Not Disclosed",
        cgpa: "7.0",
        duration: "12 Months",
        stipend: "25,000",
        offers: "7",
        status: "active",
        gradient: "from-purple-600 to-indigo-500"
    },
    {
        id: "demo-4",
        companyName: "Lumber(Intern)",
        role: "SDE Intern",
        date: "26 March 2025",
        ctc: "14 LPA",
        cgpa: "8.0",
        duration: "12 Months",
        stipend: "55,000",
        offers: "—",
        status: "active",
        gradient: "from-orange-600 to-amber-500"
    },
    {
        id: "demo-5",
        companyName: "ZS Associates",
        role: "BTSA, DAA",
        date: "4 April 2025",
        ctc: "13.65 LPA",
        cgpa: "7.0",
        duration: "—",
        stipend: "—",
        offers: "2",
        status: "active",
        gradient: "from-pink-600 to-rose-500"
    }
];

export async function getAllJobs(): Promise<Job[]> {
    const jobs: Job[] = [...DEMO_JOBS];

    try {
        const adminDb = getAdminDb();
        const jobsSnap = await adminDb.collection("jobs").orderBy("createdAt", "desc").get();

        jobsSnap.forEach((doc) => {
            const data = doc.data();
            jobs.unshift({
                id: doc.id,
                companyName: data.companyName,
                role: data.skills[0] || "Role N/A", // Use first skill as role proxy or generic
                date: new Date(data.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                ctc: "Disclosed in PDF", // Default for uploaded jobs unless we add a field
                stipend: "N/A",
                cgpa: data.minCGPA || "N/A",
                duration: "N/A",
                offers: "—",
                status: "active",
                documentUrl: data.documentUrl,
                gradient: "from-neutral-800 to-neutral-700" // Distinct style for uploaded jobs
            });
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }

    return jobs;
}
