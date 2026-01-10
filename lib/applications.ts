import { getAdminDb } from "@/lib/firebase-admin";

export interface Application {
    id: string;
    userId: string;
    jobId: string;
    companyName: string;
    role: string;
    status: "Applied" | "Under Review" | "Interview Scheduled" | "Rejected" | "Selected";
    appliedAt: string; // ISO string
}

export async function getUserApplications(userId: string): Promise<Application[]> {
    try {
        const adminDb = getAdminDb();
        const appsSnap = await adminDb
            .collection("applications")
            .where("userId", "==", userId)
            // .orderBy("appliedAt", "desc") // Requires index, filtering in memory for now if small, or let's try without orderBy first or just accept random order for MVP
            .get();

        const applications: Application[] = [];

        appsSnap.forEach((doc) => {
            const data = doc.data();
            applications.push({
                id: doc.id,
                userId: data.userId,
                jobId: data.jobId,
                companyName: data.companyName,
                role: data.role,
                status: data.status,
                appliedAt: data.appliedAt?.toDate ? data.appliedAt.toDate().toISOString() : new Date().toISOString(),
            });
        });

        // Client-side sort to avoid index requirement for now
        return applications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    } catch (error) {
        console.error("Error fetching user applications:", error);
        return [];
    }
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
    try {
        const adminDb = getAdminDb();
        const appsSnap = await adminDb
            .collection("applications")
            .where("jobId", "==", jobId)
            .get();

        const applications: Application[] = [];

        appsSnap.forEach((doc) => {
            const data = doc.data();
            applications.push({
                id: doc.id,
                userId: data.userId,
                jobId: data.jobId,
                companyName: data.companyName,
                role: data.role,
                status: data.status,
                appliedAt: data.appliedAt?.toDate ? data.appliedAt.toDate().toISOString() : new Date().toISOString(),
            });
        });

        return applications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    } catch (error) {
        console.error("Error fetching job applications:", error);
        return [];
    }
}
