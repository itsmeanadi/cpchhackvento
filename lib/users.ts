import { getAdminDb } from "@/lib/firebase-admin";

export interface UserProfile {
    email: string;
    name: string;
    role: "student" | "admin";
    fcmToken?: string;
    cgpa?: string;
    branch?: string;
}

export async function getAllStudents(): Promise<UserProfile[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("users").where("role", "==", "student").get();

    return snapshot.docs.map(doc => ({
        email: doc.id,
        ...doc.data()
    } as UserProfile));
}
