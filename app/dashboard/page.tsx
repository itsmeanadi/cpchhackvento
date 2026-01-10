import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAllJobs } from "@/lib/jobs";
import { Navbar } from "@/components/navbar";
import { ApplyButton } from "@/components/apply-button";
import { Briefcase, Calendar, UserCheck, Sparkles, ArrowUpRight, Search } from "lucide-react";

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

  if (isGuest) {
    userData = { name: "Guest Student", isProfileComplete: true };
  } else {
    const adminDb = getAdminDb();
    const userRef = adminDb.collection("users").doc(session.user.email!);
    const userSnap = await userRef.get();
    userData = userSnap.data();
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
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
              >
                Edit Profile
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-neutral-800 rounded-md text-neutral-400">
                  <Calendar size={18} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Interviews Scheduled</span>
              </div>
              <p className="text-2xl font-semibold pl-1">1</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-md ${isProfileComplete ? 'bg-emerald-900/20 text-emerald-500' : 'bg-amber-900/20 text-amber-500'}`}>
                  <UserCheck size={18} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Profile Status</span>
              </div>
              <p className={`text-sm font-medium pl-1 ${isProfileComplete ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isProfileComplete ? 'Complete & Verified' : 'Action Required'}
              </p>
            </div>
          </div>
        </div>

        {/* Job Listing Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Latest Opportunities</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search roles..."
              className="bg-neutral-900 border border-neutral-800 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neutral-600 w-64"
            />
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const isMatch = userSkills.some(us =>
                job.skills?.some(js => js.toLowerCase().includes(us.toLowerCase()) || us.toLowerCase().includes(js.toLowerCase()))
              );

              return (
                <div
                  key={job.id}
                  className={`group relative bg-neutral-900/30 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-900/50 transition-all ${isMatch ? 'ring-1 ring-indigo-500/20 bg-indigo-500/5' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-md bg-white flex items-center justify-center text-lg font-bold text-black border border-neutral-200">
                        {job.companyName.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-white">{job.companyName}</h3>
                          {isMatch && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm mt-0.5">{job.role}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                            CGPA {job.cgpa}+
                          </span>
                          <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                            {job.ctc}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                            Posted {job.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-16 md:pl-0">
                      {job.documentUrl ? (
                        <a
                          href={job.documentUrl}
                          target="_blank"
                          className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-800 rounded-md hover:bg-neutral-800 transition-colors"
                        >
                          View Details
                        </a>
                      ) : (
                        <ApplyButton jobId={job.id} />
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-lg">
              <p className="text-neutral-500">No active positions available at this moment.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}