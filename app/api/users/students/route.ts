import { getAllStudents } from "@/lib/users";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const students = await getAllStudents();
        return NextResponse.json(students);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}
