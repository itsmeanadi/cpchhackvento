"use server";

import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface Review {
    id: string;
    companyName: string;
    userId: string;
    reviewerName: string;
    reviewerBranch: string;
    rating: number;
    content: string;
    linkedinUrl?: string;
    createdAt: string; // ISO String
}

export async function getReviews(companyName: string): Promise<Review[]> {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb
            .collection("reviews")
            .where("companyName", "==", companyName)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Review));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

export async function postReview(companyName: string, rating: number, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized" };
        }

        const userId = session.user.email;
        const adminDb = getAdminDb();

        // 1. Verify Eligibility: Must be "Selected" for any job at this company
        // Note: We check 'companyName' match.
        // Ideally, application stores companyName.
        const appSnapshot = await adminDb
            .collection("applications")
            .where("userId", "==", userId)
            .where("companyName", "==", companyName)
            .where("status", "==", "Selected")
            .limit(1)
            .get();

        if (appSnapshot.empty) {
            return { success: false, message: "Only placed students can review this company." };
        }

        // 2. Get User Details for the review
        const userSnapshot = await adminDb.collection("users").doc(userId).get();
        const userData = userSnapshot.data();

        if (!userData) {
            return { success: false, message: "User profile not found." };
        }

        // 3. Create Review
        await adminDb.collection("reviews").add({
            companyName,
            userId,
            reviewerName: userData.name || "Anonymous",
            reviewerBranch: userData.branch || "N/A",
            rating,
            content,
            createdAt: new Date().toISOString(),
        });

        revalidatePath("/dashboard/apply/[id]", "page");
        return { success: true, message: "Review posted successfully!" };

    } catch (error) {
        console.error("Error posting review:", error);
        return { success: false, message: "Failed to post review." };
    }
}

// Helper to check if user CAN review (for UI state)
export async function canReview(companyName: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user?.email) return false;

    const adminDb = getAdminDb();
    const snapshot = await adminDb
        .collection("applications")
        .where("userId", "==", session.user.email)
        .where("companyName", "==", companyName)
        .where("status", "==", "Selected")
        .limit(1)
        .get();

    return !snapshot.empty;
}
