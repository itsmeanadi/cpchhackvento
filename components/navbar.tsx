"use client";

import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar({ user }: { user: any }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white text-base">CPC Portal</span>
              <span className="text-[10px] uppercase font-medium text-neutral-500">IET DAVV</span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
              </div>

              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-neutral-800 overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-400">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <span className="text-xs font-medium hidden sm:block">Log Out</span>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}