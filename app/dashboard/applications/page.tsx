import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { Navbar } from "@/components/navbar";
import { Clock, CheckCircle, XCircle, Calendar, Building2, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Application {
  id: string;
  jobId: string;
  companyName: string;
  role: string;
  appliedAt: Date;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "interview_scheduled";
  interviewDate?: Date;
}

const statusConfig = {
  pending: {
    label: "Under Review",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  reviewed: {
    label: "Reviewed",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  shortlisted: {
    label: "Shortlisted",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    icon: Calendar,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  rejected: {
    label: "Not Selected",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20"
  }
};

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    return null;
  }

  const isGuest = session.user.email === "guest_student@example.com";
  let applications: Application[] = [];

  if (isGuest) {
    // Demo data for guest users
    applications = [
      {
        id: "demo-app-1",
        jobId: "demo-1",
        companyName: "Barclays",
        role: "Software Engineering Intern",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "shortlisted",
        interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: "demo-app-2",
        jobId: "demo-2",
        companyName: "PTC",
        role: "C++ Developer",
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: "pending"
      },
      {
        id: "demo-app-3",
        jobId: "demo-5",
        companyName: "ZS Associates",
        role: "Business Technology Analyst",
        appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: "reviewed"
      }
    ];
  } else {
    // Fetch real applications from Firestore
    try {
      const adminDb = getAdminDb();
      const applicationsSnap = await adminDb
        .collection("applications")
        .where("userEmail", "==", session.user.email)
        .orderBy("appliedAt", "desc")
        .get();

      applications = applicationsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          jobId: data.jobId,
          companyName: data.companyName,
          role: data.role,
          appliedAt: data.appliedAt?.toDate?.() || new Date(),
          status: data.status || "pending",
          interviewDate: data.interviewDate?.toDate?.()
        };
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    shortlisted: applications.filter(a => a.status === "shortlisted" || a.status === "interview_scheduled").length,
    rejected: applications.filter(a => a.status === "rejected").length
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            My Applications
          </h1>
          <p className="text-neutral-400">
            Track the status of all your job applications in one place.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <p className="text-sm font-medium text-neutral-400 mb-2">Total Applications</p>
            <p className="text-3xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="bg-neutral-900 border border-amber-500/20 rounded-xl p-5">
            <p className="text-sm font-medium text-amber-500 mb-2">Under Review</p>
            <p className="text-3xl font-semibold text-amber-500">{stats.pending}</p>
          </div>
          <div className="bg-neutral-900 border border-emerald-500/20 rounded-xl p-5">
            <p className="text-sm font-medium text-emerald-500 mb-2">Shortlisted</p>
            <p className="text-3xl font-semibold text-emerald-500">{stats.shortlisted}</p>
          </div>
          <div className="bg-neutral-900 border border-red-500/20 rounded-xl p-5">
            <p className="text-sm font-medium text-red-500 mb-2">Not Selected</p>
            <p className="text-3xl font-semibold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length > 0 ? (
            applications.map((app) => {
              const config = statusConfig[app.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={app.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 font-bold text-lg text-neutral-400">
                        {app.companyName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white">{app.companyName}</h3>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.border} border`}>
                            <StatusIcon size={14} className={config.color} />
                            <span className={`text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-neutral-400 text-sm mb-3">{app.role}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <Building2 size={14} />
                            Applied {app.appliedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {app.interviewDate && (
                            <span className="flex items-center gap-1.5 text-indigo-400">
                              <Calendar size={14} />
                              Interview: {app.interviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-16 md:ml-0">
                      <button className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors border border-neutral-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl">
              <FileText size={48} className="mx-auto text-neutral-700 mb-4" />
              <p className="text-neutral-500 text-lg mb-2">No applications yet</p>
              <p className="text-neutral-600 text-sm mb-6">
                Start applying to jobs from the dashboard to track your applications here.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
