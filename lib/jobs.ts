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
    skills?: string[]; // For matchmaking
}

export const DEMO_JOBS: Job[] = [
    // --- DREAM / SUPER DREAM (High Package) ---
    {
        id: "demo-1",
        companyName: "Google",
        role: "Software Engineer",
        date: "10 September 2024",
        ctc: "45 LPA",
        cgpa: "8.5",
        duration: "Full Time",
        stipend: "1,25,000",
        offers: "3",
        status: "active",
        gradient: "from-blue-500 to-red-500"
    },
    {
        id: "demo-2",
        companyName: "Microsoft",
        role: "SDE I",
        date: "12 September 2024",
        ctc: "43 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "1,10,000",
        offers: "5",
        status: "active",
        gradient: "from-blue-600 to-blue-400"
    },
    {
        id: "demo-3",
        companyName: "Amazon",
        role: "SDE Intern",
        date: "15 September 2024",
        ctc: "44 LPA",
        cgpa: "7.5",
        duration: "6 Months",
        stipend: "80,000",
        offers: "8",
        status: "active",
        gradient: "from-orange-500 to-amber-500"
    },
    {
        id: "demo-4",
        companyName: "Atlassian",
        role: "SDE",
        date: "18 September 2024",
        ctc: "52 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "2",
        status: "active",
        gradient: "from-blue-700 to-cyan-500"
    },
    {
        id: "demo-5",
        companyName: "Salesforce",
        role: "MTS",
        date: "20 September 2024",
        ctc: "38 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "1,00,000",
        offers: "4",
        status: "active",
        gradient: "from-blue-400 to-sky-300"
    },
    {
        id: "demo-6",
        companyName: "Adobe",
        role: "Product Intern",
        date: "22 September 2024",
        ctc: "35 LPA",
        cgpa: "8.0",
        duration: "Summer",
        stipend: "1,00,000",
        offers: "5",
        status: "active",
        gradient: "from-red-600 to-orange-500"
    },
    {
        id: "demo-7",
        companyName: "Uber",
        role: "SDE I",
        date: "25 September 2024",
        ctc: "48 LPA",
        cgpa: "8.5",
        duration: "Full Time",
        stipend: "N/A",
        offers: "2",
        status: "active",
        gradient: "from-black to-neutral-800"
    },
    {
        id: "demo-8",
        companyName: "D. E. Shaw",
        role: "Quality Engineer",
        date: "28 September 2024",
        ctc: "37 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "90,000",
        offers: "3",
        status: "active",
        gradient: "from-teal-600 to-emerald-500"
    },
    {
        id: "demo-9",
        companyName: "Arcesium",
        role: "Software Engineer",
        date: "01 October 2024",
        ctc: "36 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "85,000",
        offers: "4",
        status: "active",
        gradient: "from-slate-700 to-slate-500"
    },
    {
        id: "demo-10",
        companyName: "Goldman Sachs",
        role: "Summer Analyst",
        date: "05 October 2024",
        ctc: "32 LPA",
        cgpa: "7.5",
        duration: "Summer",
        stipend: "75,000",
        offers: "12",
        status: "active",
        gradient: "from-cyan-700 to-blue-600"
    },

    // --- FINTECH / BANKING ---
    {
        id: "demo-11",
        companyName: "JPMC",
        role: "SDE",
        date: "08 October 2024",
        ctc: "22 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "60,000",
        offers: "25",
        status: "active",
        gradient: "from-blue-900 to-indigo-800"
    },
    {
        id: "demo-12",
        companyName: "Morgan Stanley",
        role: "Technology Analyst",
        date: "10 October 2024",
        ctc: "26 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "70,000",
        offers: "8",
        status: "active",
        gradient: "from-indigo-600 to-blue-500"
    },
    {
        id: "demo-13",
        companyName: "Wells Fargo",
        role: "Program Associate",
        date: "12 October 2024",
        ctc: "24 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "50,000",
        offers: "15",
        status: "active",
        gradient: "from-red-700 to-yellow-600"
    },
    {
        id: "demo-14",
        companyName: "Barclays",
        role: "BA3 Intern",
        date: "15 October 2024",
        ctc: "14 LPA",
        cgpa: "7.0",
        duration: "Summer",
        stipend: "50,000",
        offers: "20",
        status: "active",
        gradient: "from-sky-500 to-blue-600"
    },
    {
        id: "demo-15",
        companyName: "Deutsche Bank",
        role: "Trainee Analyst",
        date: "18 October 2024",
        ctc: "19 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "45,000",
        offers: "10",
        status: "active",
        gradient: "from-blue-800 to-sky-700"
    },
    {
        id: "demo-16",
        companyName: "Citi Corp",
        role: "Apps Dev Analyst",
        date: "20 October 2024",
        ctc: "18 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "55,000",
        offers: "18",
        status: "active",
        gradient: "from-gray-300 to-blue-500"
    },
    {
        id: "demo-17",
        companyName: "Bank of America",
        role: "Tech Analyst",
        date: "22 October 2024",
        ctc: "16 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "40,000",
        offers: "12",
        status: "active",
        gradient: "from-red-600 to-blue-800"
    },
    {
        id: "demo-18",
        companyName: "Mastercard",
        role: "Consultant",
        date: "25 October 2024",
        ctc: "15 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "50,000",
        offers: "10",
        status: "active",
        gradient: "from-orange-500 to-red-500"
    },
    {
        id: "demo-19",
        companyName: "Visa",
        role: "Software Engineer",
        date: "28 October 2024",
        ctc: "28 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "70,000",
        offers: "5",
        status: "active",
        gradient: "from-blue-700 to-yellow-500"
    },
    {
        id: "demo-20",
        companyName: "American Express",
        role: "Engineer I",
        date: "30 October 2024",
        ctc: "20 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "60,000",
        offers: "8",
        status: "active",
        gradient: "from-blue-500 to-cyan-500"
    },

    // --- INDIAN STARTUPS / UNICORNS ---
    {
        id: "demo-21",
        companyName: "Zomato",
        role: "SDE - Backend",
        date: "05 November 2024",
        ctc: "26 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "60,000",
        offers: "6",
        status: "active",
        gradient: "from-red-600 to-red-500"
    },
    {
        id: "demo-22",
        companyName: "Swiggy",
        role: "SDE I",
        date: "08 November 2024",
        ctc: "24 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "55,000",
        offers: "5",
        status: "active",
        gradient: "from-orange-500 to-orange-400"
    },
    {
        id: "demo-23",
        companyName: "Razorpay",
        role: "Frontend Engineer",
        date: "10 November 2024",
        ctc: "28 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "60,000",
        offers: "4",
        status: "active",
        gradient: "from-blue-600 to-indigo-600"
    },
    {
        id: "demo-24",
        companyName: "Cred",
        role: "Backend Intern",
        date: "12 November 2024",
        ctc: "30 LPA",
        cgpa: "8.0",
        duration: "6 Months",
        stipend: "1,00,000",
        offers: "3",
        status: "active",
        gradient: "from-black to-neutral-900"
    },
    {
        id: "demo-25",
        companyName: "Paytm",
        role: "SDE",
        date: "15 November 2024",
        ctc: "16 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "40,000",
        offers: "15",
        status: "active",
        gradient: "from-blue-600 to-cyan-400"
    },
    {
        id: "demo-26",
        companyName: "Ola Electric",
        role: "Embedded Engineer",
        date: "18 November 2024",
        ctc: "18 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "35,000",
        offers: "10",
        status: "active",
        gradient: "from-green-500 to-lime-500"
    },
    {
        id: "demo-27",
        companyName: "Flipkart",
        role: "SDE I",
        date: "20 November 2024",
        ctc: "32 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "1,00,000",
        offers: "8",
        status: "active",
        gradient: "from-blue-500 to-yellow-400"
    },
    {
        id: "demo-28",
        companyName: "PhonePe",
        role: "Android Dev",
        date: "22 November 2024",
        ctc: "30 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "80,000",
        offers: "6",
        status: "active",
        gradient: "from-purple-600 to-purple-500"
    },
    {
        id: "demo-29",
        companyName: "Meesho",
        role: "SDE I",
        date: "25 November 2024",
        ctc: "22 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "50,000",
        offers: "8",
        status: "active",
        gradient: "from-pink-600 to-rose-400"
    },
    {
        id: "demo-30",
        companyName: "Groww",
        role: "Software Dev",
        date: "28 November 2024",
        ctc: "20 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "50,000",
        offers: "10",
        status: "active",
        gradient: "from-emerald-500 to-teal-500"
    },

    // --- MASS RECRUITERS / SERVICE BASED ---
    {
        id: "demo-31",
        companyName: "TCS",
        role: "Digital/Prime",
        date: "01 December 2024",
        ctc: "3.36 - 9 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "150",
        status: "active",
        gradient: "from-indigo-600 to-purple-600"
    },
    {
        id: "demo-32",
        companyName: "Infosys",
        role: "System Engineer",
        date: "05 December 2024",
        ctc: "3.6 - 9.5 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "15,000",
        offers: "200",
        status: "active",
        gradient: "from-blue-700 to-blue-500"
    },
    {
        id: "demo-33",
        companyName: "Wipro",
        role: "Project Engineer",
        date: "08 December 2024",
        ctc: "3.5 - 6.5 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "120",
        status: "active",
        gradient: "from-green-600 to-teal-500"
    },
    {
        id: "demo-34",
        companyName: "Accenture",
        role: "ASE / AA",
        date: "10 December 2024",
        ctc: "4.5 - 6.5 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "N/A",
        offers: "180",
        status: "active",
        gradient: "from-purple-600 to-indigo-500"
    },
    {
        id: "demo-35",
        companyName: "Capgemini",
        role: "Senior Analyst",
        date: "12 December 2024",
        ctc: "4.0 - 7.5 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "100",
        status: "active",
        gradient: "from-blue-500 to-blue-400"
    },
    {
        id: "demo-36",
        companyName: "Cognizant",
        role: "GenC / GenC Next",
        date: "15 December 2024",
        ctc: "4.0 - 6.75 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "12,000",
        offers: "140",
        status: "active",
        gradient: "from-blue-800 to-indigo-700"
    },
    {
        id: "demo-37",
        companyName: "LTIMindtree",
        role: "Graduate Trainee",
        date: "18 December 2024",
        ctc: "4.5 - 6.0 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "80",
        status: "active",
        gradient: "from-blue-600 to-cyan-600"
    },
    {
        id: "demo-38",
        companyName: "HCL Tech",
        role: "Software Engineer",
        date: "20 December 2024",
        ctc: "4.25 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "15,000",
        offers: "90",
        status: "active",
        gradient: "from-purple-700 to-indigo-600"
    },
    {
        id: "demo-39",
        companyName: "Tech Mahindra",
        role: "Associate SE",
        date: "22 December 2024",
        ctc: "3.25 - 5.5 LPA",
        cgpa: "6.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "110",
        status: "active",
        gradient: "from-red-600 to-red-500"
    },
    {
        id: "demo-40",
        companyName: "IBM",
        role: "Associate Dev",
        date: "25 December 2024",
        ctc: "4.5 - 7.0 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "20,000",
        offers: "70",
        status: "active",
        gradient: "from-blue-900 to-blue-700"
    },

    // --- CORE / OTHERS ---
    {
        id: "demo-41",
        companyName: "Tata Motors",
        role: "GET",
        date: "05 January 2025",
        ctc: "8.5 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "30,000",
        offers: "25",
        status: "active",
        gradient: "from-blue-700 to-indigo-600"
    },
    {
        id: "demo-42",
        companyName: "Reliance Jio",
        role: "GET / SDE",
        date: "08 January 2025",
        ctc: "7.5 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "25,000",
        offers: "40",
        status: "active",
        gradient: "from-blue-600 to-red-500"
    },
    {
        id: "demo-43",
        companyName: "L&T",
        role: "GET",
        date: "10 January 2025",
        ctc: "6.5 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "20,000",
        offers: "35",
        status: "active",
        gradient: "from-yellow-600 to-orange-500"
    },
    {
        id: "demo-44",
        companyName: "Samsung R&D",
        role: "Software Engineer",
        date: "12 January 2025",
        ctc: "16 - 22 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "50,000",
        offers: "30",
        status: "active",
        gradient: "from-blue-800 to-blue-600"
    },
    {
        id: "demo-45",
        companyName: "Oracle",
        role: "App Developer",
        date: "15 January 2025",
        ctc: "33 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "80,000",
        offers: "10",
        status: "active",
        gradient: "from-red-600 to-red-500"
    },
    {
        id: "demo-46",
        companyName: "Cisco",
        role: "Network Engineer",
        date: "18 January 2025",
        ctc: "18 - 24 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "60,000",
        offers: "15",
        status: "active",
        gradient: "from-cyan-600 to-blue-500"
    },
    {
        id: "demo-47",
        companyName: "Nvidia",
        role: "System Software",
        date: "20 January 2025",
        ctc: "35 LPA",
        cgpa: "8.0",
        duration: "Full Time",
        stipend: "85,000",
        offers: "5",
        status: "active",
        gradient: "from-green-600 to-green-500"
    },
    {
        id: "demo-48",
        companyName: "Qualcomm",
        role: "Engineer",
        date: "22 January 2025",
        ctc: "30 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "65,000",
        offers: "8",
        status: "active",
        gradient: "from-blue-700 to-indigo-700"
    },
    {
        id: "demo-49",
        companyName: "Intel",
        role: "Firmware Engineer",
        date: "25 January 2025",
        ctc: "25 LPA",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "55,000",
        offers: "12",
        status: "active",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "demo-50",
        companyName: "ZS Associates",
        role: "BTSA",
        date: "28 January 2025",
        ctc: "13.65 LPA",
        cgpa: "7.0",
        duration: "Full Time",
        stipend: "N/A",
        offers: "25",
        status: "active",
        gradient: "from-blue-600 to-blue-500"
    },
    {
        id: "demo-51",
        companyName: "Deloitte",
        role: "Analyst",
        date: "02 February 2025",
        ctc: "7.6 LPA",
        cgpa: "6.5",
        duration: "Full Time",
        stipend: "25,000",
        offers: "60",
        status: "active",
        gradient: "from-black to-green-900"
    },
    {
        id: "demo-52",
        companyName: "Accenture Japan",
        role: "Software Engineer",
        date: "05 February 2025",
        ctc: "45 LPA (Equivalent)",
        cgpa: "7.5",
        duration: "Full Time",
        stipend: "N/A",
        offers: "5",
        status: "active",
        gradient: "from-purple-600 to-pink-600"
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
                skills: data.skills || [], // Map actual skills
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

    return jobs.map(job => ({
        ...job,
        skills: job.skills || getInferredSkills(job.companyName, job.role)
    }));
}

function getInferredSkills(company: string, role: string): string[] {
    const s = (company + role).toLowerCase();
    if (s.includes("google") || s.includes("microsoft") || s.includes("amazon") || s.includes("sde")) return ["C++", "Java", "DSA", "System Design"];
    if (s.includes("frontend") || s.includes("react") || s.includes("web")) return ["React", "JavaScript", "CSS"];
    if (s.includes("backend") || s.includes("node")) return ["Node.js", "SQL", "API"];
    if (s.includes("data")) return ["Python", "SQL", "Excel", "ML"];
    if (s.includes("analyst") || s.includes("consultant")) return ["Excel", "Communication", "Management"];
    return ["Java", "C++", "Communication"]; // Generic fallback
}

export async function getJobById(id: string): Promise<Job | null> {
    // 1. Check Demo Jobs First
    const demoJob = DEMO_JOBS.find(j => j.id === id);
    if (demoJob) return demoJob;

    // 2. Check Firestore
    try {
        const adminDb = getAdminDb();
        const doc = await adminDb.collection("jobs").doc(id).get();
        if (doc.exists) {
            const data = doc.data()!;
            return {
                id: doc.id,
                companyName: data.companyName,
                role: data.skills[0] || "Role N/A",
                date: new Date(data.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                ctc: "Disclosed in PDF",
                stipend: "N/A",
                cgpa: data.minCGPA || "N/A",
                duration: "N/A",
                offers: "—",
                status: "active",
                documentUrl: data.documentUrl,
                gradient: "from-neutral-800 to-neutral-700"
            };
        }
    } catch (error) {
        console.error("Error fetching job by ID:", error);
    }

    return null;
}
