import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getAdminDb } from "@/lib/firebase-admin";

const ADMIN_EMAILS = ["tpo@ietdavv.edu.in", "hod.cs@ietdavv.edu.in", "1anadi1sharma@gmail.com"];

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Guest Access",
      credentials: {
        email: { label: "Email", type: "text" },
        role: { label: "Role", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, role } = credentials;

        if (email === "guest_admin@example.com" || email === "guest_student@example.com") {
          return {
            id: email,
            email: email,
            name: role === "admin" ? "Guest Admin" : "Guest Student",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
            role: role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (!user?.email) return false;

      // Allow Guest Users
      if (user.email === "guest_admin@example.com" || user.email === "guest_student@example.com") {
        return true;
      }

      const isAllowedDomain = user.email.toLowerCase().endsWith("@ietdavv.edu.in");
      const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

      // 1. Strict Access Control
      if (!isAllowedDomain && !isAdmin) return false;

      try {
        const adminDb = getAdminDb();
        const userRef = adminDb.collection("users").doc(user.email);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          // 2. Create New User (First Login)
          await userRef.set({
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? "admin" : "student",
            createdAt: new Date(),
            lastLogin: new Date(),
            // Student specific fields (empty initially)
            branch: "",
            cgpa: 0,
            isPlaced: false,
            resumeUrl: "",
            phone: "",
            githubUrl: "",
            linkedinUrl: "",
            isProfileComplete: false // Initially false for new users
          });
        } else {
          // 3. Update Existing User
          await userRef.update({
            lastLogin: new Date(),
            image: user.image // Keep profile pic synced with Google
          });
        }
        return true;
      } catch (error) {
        console.error("Firestore Error:", error);
        return false; // Deny login if DB fails
      }
    },
    async jwt({ token, user }: any) {
      if (user?.email) {
        // Update role based on email
        if (user.email === "guest_admin@example.com") {
          token.role = "admin";
        } else if (user.email === "guest_student@example.com") {
          token.role = "student";
        } else {
          token.role = ADMIN_EMAILS.includes(user.email)
            ? "admin"
            : "student";
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  trustHost: true,
};

import { getServerSession } from "next-auth/next";

// Wrapper for getServerSession to verify/mock v5-like behavior
export const auth = async () => {
  // Temporarily suppress NextAuth JWT_SESSION_ERROR console logs
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filter out NextAuth JWT_SESSION_ERROR from stale cookies
    const message = String(args[0] || '');
    if (message.includes('JWT_SESSION_ERROR') || message.includes('decryption operation failed')) {
      return; // Suppress this specific error
    }
    originalError.apply(console, args);
  };

  try {
    return await getServerSession(authConfig);
  } catch (error) {
    // Return null for invalid/stale sessions
    return null;
  } finally {
    // Always restore original console.error
    console.error = originalError;
  }
};

// signIn and signOut are usually client-side in v4, so we don't export them for server use
// unless we want to implement server-side logic, but for now removing the v5 exports.

// Type augmentation for TypeScript
declare module "next-auth" {
  interface Session {
    user: {
      role: "admin" | "student";
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "student";
  }
}