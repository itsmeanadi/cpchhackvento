"use server";

import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getJobById } from "@/lib/jobs";
import { revalidatePath } from "next/cache";

export async function applyJob(jobId: string) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return { success: false, message: "Not authenticated" };
        }

        const userId = session.user.email; // Using email as ID based on existing patterns

        // 1. Verify Job Exists
        const job = await getJobById(jobId);
        if (!job) {
            return { success: false, message: "Job not found" };
        }

        const adminDb = getAdminDb();

        // 2. Check if already applied
        const existingApp = await adminDb
            .collection("applications")
            .where("userId", "==", userId)
            .where("jobId", "==", jobId)
            .limit(1)
            .get();

        if (!existingApp.empty) {
            return { success: false, message: "You have already applied for this job." };
        }

        // 3. Verify Eligibility (CGPA)
        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        if (job.cgpa && job.cgpa !== "N/A") {
            const userCgpa = parseFloat(userData?.cgpa || "0");
            const requiredCgpa = parseFloat(job.cgpa.toString());

            if (!isNaN(requiredCgpa) && !isNaN(userCgpa) && userCgpa < requiredCgpa) {
                return {
                    success: false,
                    message: `Not Eligible: Your CGPA (${userCgpa}) is below the required ${requiredCgpa}.`
                };
            }
        }

        // 4. Create Application
        await adminDb.collection("applications").add({
            userId,
            jobId,
            companyName: job.companyName,
            role: job.role,
            status: "Applied",
            appliedAt: new Date(),
            studentName: userData?.name || "Unknown", // Store snapshot of name
            studentCgpa: userData?.cgpa || "N/A", // Store snapshot of CGPA
            studentBranch: userData?.branch || "N/A", // Store snapshot of Branch
        });

        // 4. Revalidate
        revalidatePath("/dashboard/applications");
        revalidatePath("/dashboard");

        return { success: true, message: "Application submitted successfully!" };

    } catch (error) {
        console.error("Error applying for job:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}

export async function updateApplicationStatus(applicationId: string, status: string, jobId: string) {
    try {
        const session = await auth();

        // Strictly check for admin role
        if (!session?.user || session.user.role !== "admin") {
            return { success: false, message: "Unauthorized" };
        }

        const adminDb = getAdminDb();

        await adminDb.collection("applications").doc(applicationId).update({
            status,
            updatedAt: new Date(),
        });

        // Revalidate admin page and student application page
        revalidatePath(`/admin/jobs/${jobId}/applications`);
        revalidatePath("/dashboard/applications");

        return { success: true, message: "Status updated successfully" };
    } catch (error) {
        console.error("Error updating application status:", error);
        return { success: false, message: "Failed to update status" };
    }
}
