```
import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAllJobs } from "@/lib/jobs";
import { Navbar } from "@/components/navbar";
import { ApplyButton } from "@/components/apply-button";
import { Briefcase, Calendar, UserCheck, Sparkles, ArrowUpRight, BarChart3 } from "lucide-react";
import { JobList } from "@/components/job-list";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    return null;
  }

  // Unified Data Fetching
  const jobs = await getAllJobs();

  // Determine if Guest
  const isGuest = session.user.email === "guest_student@example.com";

  let userData;

  try {
    const adminDb = getAdminDb();
    const userRef = adminDb.collection("users").doc(session.user.email!);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      userData = userSnap.data();
    } else if (isGuest) {
      // Fallback for Guest if not yet initialized in DB
      userData = { name: "Guest Student", isProfileComplete: true, cgpa: "8.5" };
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }

  // Fetch User Applications
  let appliedJobIds: string[] = [];

  try {
    const adminDb = getAdminDb();
    const appsSnap = await adminDb
      .collection("applications")
      .where("userId", "==", session.user.email)
      .get();

    appliedJobIds = appsSnap.docs.map(doc => doc.data().jobId);
  } catch (error) {
    console.error("Error fetching applications:", error);
  }

  // Fetch Scheduled Interviews
  let interviewCount = 0;
  try {
    const adminDb = getAdminDb();
    const interviewsSnap = await adminDb
      .collection("interviews")
      .where("studentEmail", "==", session.user.email)
      .get();
    interviewCount = interviewsSnap.size;
  } catch (error) {
    console.error("Error fetching interviews:", error);
  }

  // Sanitize userData for Client Component
  if (userData) {
    userData = {
      ...userData,
      createdAt: userData.createdAt?.toDate?.().toISOString() || null,
      updatedAt: userData.updatedAt?.toDate?.().toISOString() || null,
      lastLogin: userData.lastLogin?.toDate?.().toISOString() || null,
    } as any;
  }

  const userSkills = (userData?.skills || []) as string[];
  const isProfileComplete = userData?.isProfileComplete;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">

      <Navbar user={session.user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-white mb-2">
                Welcome back, {userData?.name?.split(' ')[0]}
              </h1>
              <p className="text-neutral-400">
                Track your applications and explore new opportunities.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href="/dashboard/interviews"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Calendar size={16} />
                My Interviews
              </a>
              <a
                href="/dashboard/applications"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                <Briefcase size={16} />
                My Applications
              </a>
              <a
                href="/dashboard/resume"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Sparkles size={16} />
                AI Resume Doctor
              </a>
              <a
                href="/dashboard/analytics"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-500/20"
              >
                <BarChart3 size={16} />
                Analytics
              </a>
              <a
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
              >
                Edit Profile
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            {/* Applications Card */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-neutral-800 rounded-md text-neutral-400">
                  <Briefcase size={18} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Applications Submitted</span>
              </div>
              <p className="text-2xl font-semibold pl-1">{appliedJobIds.length}</p>
            </div>

            {/* Interviews Card */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-neutral-800 rounded-md text-neutral-400">
                  <Calendar size={18} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Interviews Scheduled</span>
              </div>
              <p className="text-2xl font-semibold pl-1">{interviewCount}</p>
            </div>

            {/* Profile Status Card */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p - 2 rounded - md ${ isProfileComplete ? 'bg-emerald-900/20 text-emerald-500' : 'bg-amber-900/20 text-amber-500' } `}>
                  <UserCheck size={18} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Profile Status</span>
              </div>
              <p className={`text - sm font - medium pl - 1 ${ isProfileComplete ? 'text-emerald-500' : 'text-amber-500' } `}>
                {isProfileComplete ? 'Complete & Verified' : 'Action Required'}
              </p>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <JobList jobs={jobs} userSkills={userSkills} appliedJobIds={appliedJobIds} userData={userData} />

      </main>
    </div>
  );
}