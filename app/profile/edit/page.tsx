import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { updateProfile } from "../actions";
import { Navbar } from "@/components/navbar";
import { Save, User, BookOpen, Link2 as LinkIcon, Sparkles, Layers } from "lucide-react";
import { DemoFillButton } from "@/components/demo-fill-button";

export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const adminDb = getAdminDb();
  const userRef = adminDb.collection("users").doc(session.user.email);
  const snap = await userRef.get();
  const data = snap.data() || {};

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">

      {/* [Background] */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        <Navbar user={session.user} />

        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">

          {/* [Header] */}
          <div className="mb-12 animate-slide-up flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles size={14} />
                </span>
                <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                  Profile Configuration
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-white mb-4">
                Candidate Dossier
              </h1>
              <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed font-light">
                Complete your academic and personal details.
                <span className="text-neutral-500"> Comprehensive profiles receive 40% more visibility.</span>
              </p>
            </div>

            {/* [New Button] Placed here for easy access during demos */}
            <div className="mb-2">
              <DemoFillButton />
            </div>
          </div>

          {/* [Card] Glassmorphism Container */}
          <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 animate-slide-up delay-100">

            <form action={updateProfile}>

              <div className="flex flex-col divide-y divide-white/5">

                {/* Section 1: Personal Identity */}
                <div className="p-8 sm:p-10 group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <User size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-medium tracking-tight text-white">Personal Identity</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={data.phone || ""}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        defaultValue={data.dob || ""}
                        required
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Gender</label>
                      <div className="relative">
                        <select
                          name="gender"
                          defaultValue={data.gender || ""}
                          required
                          className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none hover:border-white/20"
                        >
                          <option value="" className="bg-neutral-900">Select Gender</option>
                          <option value="Male" className="bg-neutral-900">Male</option>
                          <option value="Female" className="bg-neutral-900">Female</option>
                          <option value="Other" className="bg-neutral-900">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Metrics */}
                <div className="p-8 sm:p-10 group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-medium tracking-tight text-white">Academic History</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Branch</label>
                      <div className="relative">
                        <select
                          name="branch"
                          defaultValue={data.branch || "CSE"}
                          required
                          className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none hover:border-white/20"
                        >
                          <option value="CSE" className="bg-neutral-900">Computer Science</option>
                          <option value="IT" className="bg-neutral-900">Information Technology</option>
                          <option value="ECE" className="bg-neutral-900">Electronics & Comm.</option>
                          <option value="MECH" className="bg-neutral-900">Mechanical</option>
                          <option value="CIVIL" className="bg-neutral-900">Civil Engineering</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Current CGPA</label>
                      <input
                        type="number"
                        name="cgpa"
                        step="0.01"
                        min="0"
                        max="10"
                        defaultValue={data.cgpa || ""}
                        required
                        placeholder="e.g. 8.5"
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Backlogs</label>
                      <input
                        type="number"
                        name="backlogs"
                        min="0"
                        defaultValue={data.backlogs || 0}
                        required
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mt-8">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">10th Grade (%)</label>
                      <input
                        type="number"
                        name="tenthMarks"
                        step="0.01"
                        min="0"
                        max="100"
                        defaultValue={data.tenthMarks || ""}
                        required
                        placeholder="e.g. 92.5"
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">12th Grade (%)</label>
                      <input
                        type="number"
                        name="twelfthMarks"
                        step="0.01"
                        min="0"
                        max="100"
                        defaultValue={data.twelfthMarks || ""}
                        required
                        placeholder="e.g. 88.0"
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Skills */}
                <div className="p-8 sm:p-10 group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <Layers size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-medium tracking-tight text-white">Skills & Competencies</h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Technical Skills</label>
                    <textarea
                      name="skills"
                      rows={3}
                      defaultValue={data.skills || ""}
                      placeholder="e.g. React, Python, Data Structures (Comma separated)"
                      className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20 resize-none"
                    />
                  </div>
                </div>

                {/* Section 4: Digital Footprint */}
                <div className="p-8 sm:p-10 group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <LinkIcon size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-medium tracking-tight text-white">Digital Footprint</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Resume / CV Asset</label>
                        <span className="text-[10px] text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">Docs/PDF Format</span>
                      </div>
                      <input
                        type="url"
                        name="resumeUrl"
                        defaultValue={data.resumeUrl || ""}
                        required
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">LinkedIn Profile</label>
                        <input
                          type="url"
                          name="linkedinUrl"
                          defaultValue={data.linkedinUrl || ""}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">GitHub Profile</label>
                        <input
                          type="url"
                          name="githubUrl"
                          defaultValue={data.githubUrl || ""}
                          placeholder="https://github.com/..."
                          className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 sm:p-10 bg-neutral-950/30 border-t border-white/5 flex items-center justify-end gap-6">
                  <a href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors">Discard</a>
                  <button
                    type="submit"
                    className="group relative inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl text-sm font-bold tracking-wide overflow-hidden transition-all hover:bg-neutral-200 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Save size={16} className="relative z-10" />
                    <span className="relative z-10">Save Configuration</span>
                  </button>
                </div>

              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}