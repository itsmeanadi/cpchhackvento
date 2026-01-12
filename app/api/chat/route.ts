import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Groq from "groq-sdk";
import { getAllJobs } from "@/lib/jobs";
import { getPlacementStats } from "@/lib/analytics";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages } = await req.json();
        const role = session.user.role; // "student" or "admin"
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("GROQ_API_KEY is missing");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // --- Context Gathering ---
        let context = "";

        if (role === "admin") {
            // Admin Context: Placement Stats + Job Drives
            const stats = await getPlacementStats();
            const jobs = await getAllJobs();

            context = `
            You are an AI Assistant for the Placement Cell Administrator.
            
            Current Placement Statistics:
            - Total Students: ${stats.totalStudents}
            - Placed Students: ${stats.placedStudents}
            - Unplaced: ${stats.unplacedStudents}
            - Placement Rate: ${stats.placementRate}%
            - Branch Breakdown: ${JSON.stringify(stats.branchDistribution)}
            
            Active Job Drives:
            ${jobs.map(j => `- ${j.companyName} (${j.role}): Status ${j.status}`).join('\n')}
            
            Answer questions about placement progress, student stats, and drive status.
            `;

        } else {
            // Student Context: Available Jobs
            const jobs = await getAllJobs();
            const activeJobs = jobs.filter(j => j.status === "active");

            context = `
            You are an AI Assistant for a Student at the Placement Cell.
            
            Active Job Opportunities:
            ${activeJobs.map(j => `
            - Company: ${j.companyName}
              Role: ${j.role}
              CTC: ${j.ctc}
              CGPA Req: ${j.cgpa}
              Stipend: ${j.stipend}
              Date: ${j.date}
            `).join('\n')}
            
            Answer questions about companies coming to campus, eligibility, and preparation tips based on these roles.
            `;
        }

        const groq = new Groq({ apiKey });

        // Prepend Context System Message
        const finalMessages = [
            { role: "system", content: context },
            ...messages
        ];

        const completion = await groq.chat.completions.create({
            messages: finalMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
    }
}
