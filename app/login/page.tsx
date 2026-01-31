import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./google-button";
import { GuestLoginButtons } from "./guest-buttons";
import { Youtube, FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950 text-white selection:bg-indigo-500/30">
      <div className="w-full max-w-sm p-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-sm">

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              CPC Access
            </h2>
            <p className="text-neutral-400 text-sm mb-4">
              Placement Portal • IET DAVV
            </p>

            <div className="bg-neutral-800/50 rounded-lg p-3 text-[13px] text-left text-neutral-400 space-y-1 border border-neutral-800">
              <p>🔹 <strong className="text-neutral-300">Admin:</strong> Configurable for any email.</p>
              <p>🔹 <strong className="text-neutral-300">Student:</strong> Restricted to <span className="text-indigo-400">@ietdavv.edu.in</span>.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <GoogleSignInButton />
            </div>

            <div className="space-y-4">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Prototype Demo</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="https://youtu.be/YD6HEPaqqqU"
                  target="_blank"
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/30 border border-neutral-800 hover:bg-neutral-800 transition-colors group"
                >
                  <Youtube size={18} className="text-red-500" />
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Video Pitch</span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1MFQhcEdBPjsOMZbINlyWSBo-xjQ_NYta"
                  target="_blank"
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/30 border border-neutral-800 hover:bg-neutral-800 transition-colors group"
                >
                  <FolderOpen size={18} className="text-blue-400" />
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Project Assets</span>
                </a>
              </div>
            </div>

            <div>
              <GuestLoginButtons />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              For prototype testing, check <strong>Guest Access</strong> above.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
