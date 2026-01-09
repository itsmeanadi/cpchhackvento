"use server";

import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const rawData = {
    phone: formData.get("phone") as string,
    branch: formData.get("branch") as string,
    cgpa: Number(formData.get("cgpa")),
    resumeUrl: formData.get("resumeUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
  };

  if (!rawData.phone || !rawData.branch || isNaN(rawData.cgpa)) {
    throw new Error("Missing required fields");
  }

  const adminDb = getAdminDb();

  await adminDb
    .collection("users")
    .doc(session.user.email)
    .update({
      ...rawData,
      isProfileComplete: true,
      updatedAt: new Date(),
    });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
