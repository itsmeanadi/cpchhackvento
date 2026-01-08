import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./google-button"; // Client component below

export default async function LoginPage() {
  const session = await auth();

  /* 
  // Redundant redirect handled by middleware. 
  // keeping this commented out to prevent infinite loops if middleware / page session states drift.
  if (session?.user) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  } 
  */

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-200/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-8 sm:p-10 animate-slide-up">

          {/* Branding Section */}
          <div className="text-center mb-10">
            <div className="mx-auto h-14 w-14 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30 ring-1 ring-black/5 transform rotate-3">
              <span className="text-white font-bold text-lg tracking-tight">CPC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
              Welcome Back
            </h2>
            <p className="mt-3 text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
              Login to access the Central Placement Cell portal and manage your journey.
            </p>
          </div>

          {/* Action Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Secure Access
                </span>
              </div>
            </div>

            <GoogleSignInButton />

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400 leading-relaxed">
                Restricted to <span className="font-semibold text-brand-600">@ietdavv.edu.in</span> accounts.
                <br />
                Contact TPO for access issues.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-slate-400 font-medium opacity-60">
          &copy; {new Date().getFullYear()} Placement Cell. All rights reserved.
        </p>
      </div>
    </main>
  );
}