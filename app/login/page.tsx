import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./google-button";

export const dynamic = "force-dynamic";
import { GuestLoginButtons } from "./guest-buttons";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950 text-white">
      {/* Simple clean container */}
      <div className="w-full max-w-sm p-6">

        {/* Simple Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-sm">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              CPC Access
            </h2>
            <p className="text-neutral-400 text-sm">
              Placement Portal • IET DAVV
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <GoogleSignInButton />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-neutral-600 font-medium uppercase">Prototype Demo</span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <div>
              <GuestLoginButtons />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-600">
              Restricted to @ietdavv.edu.in
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}