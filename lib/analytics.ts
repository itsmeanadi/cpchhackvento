import { getAdminDb } from "@/lib/firebase-admin";

export interface PlacementStats {
    totalStudents: number;
    placedStudents: number;
    unplacedStudents: number;
    placementRate: number;
    branchDistribution: { branch: string; placed: number; total: number }[];
    totalOffers: number;
}

export async function getPlacementStats(): Promise<PlacementStats> {
    try {
        const db = getAdminDb();

        // 1. Fetch all students to get branch info and total count
        const studentsSnap = await db.collection("users").where("role", "==", "student").get();
        const students = studentsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as { id: string; branch?: string; name: string }[];

        const totalStudents = students.length;

        // 2. Fetch all "Selected" applications (Placed students)
        const placementsSnap = await db.collection("applications")
            .where("status", "==", "Selected")
            .get();

        const placedUserIds = new Set<string>();
        let totalOffers = 0;

        placementsSnap.docs.forEach(doc => {
            const data = doc.data();
            placedUserIds.add(data.userId); // userId is email
            totalOffers++;
        });

        const placedStudents = placedUserIds.size;
        const unplacedStudents = totalStudents - placedStudents;
        const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

        // 3. Aggregate Branch-wise Data
        const branchMap = new Map<string, { placed: number; total: number }>();

        students.forEach(student => {
            const branch = student.branch || "Unknown";
            if (!branchMap.has(branch)) {
                branchMap.set(branch, { placed: 0, total: 0 });
            }

            const stats = branchMap.get(branch)!;
            stats.total++;

            if (placedUserIds.has(student.id)) { // student.id is email
                stats.placed++;
            }
        });

        const branchDistribution = Array.from(branchMap.entries()).map(([branch, stats]) => ({
            branch,
            placed: stats.placed,
            total: stats.total
        }));

        return {
            totalStudents,
            placedStudents,
            unplacedStudents,
            placementRate: Math.round(placementRate * 10) / 10,
            branchDistribution,
            totalOffers
        };

    } catch (error) {
        console.error("Error fetching placement stats:", error);
        return {
            totalStudents: 0,
            placedStudents: 0,
            unplacedStudents: 0,
            placementRate: 0,
            branchDistribution: [],
            totalOffers: 0
        };
    }
}
