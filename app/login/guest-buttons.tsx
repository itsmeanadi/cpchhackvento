"use client";

import { signIn } from "next-auth/react";

export function GuestLoginButtons() {
    const handleGuestLogin = (role: "admin" | "student") => {
        signIn("credentials", {
            email: role === "admin" ? "guest_admin@example.com" : "guest_student@example.com",
            role: role,
            callbackUrl: role === "admin" ? "/admin" : "/dashboard",
        });
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-neutral-500 font-light">PROTOTYPE ACCESS</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleGuestLogin("student")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 text-white rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 text-xs font-medium tracking-wide uppercase group"
                >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-shadow"></span>
                    Guest Student
                </button>

                <button
                    onClick={() => handleGuestLogin("admin")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 text-white rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 text-xs font-medium tracking-wide uppercase group"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-shadow"></span>
                    Guest Admin
                </button>
            </div>
        </div>
    );
}
