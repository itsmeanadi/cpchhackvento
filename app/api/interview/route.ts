import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages, jobContext } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const systemPrompt = `
        You are an expert AI Technical Interviewer for ${jobContext.companyName}.
        Role: ${jobContext.role}
        Skills Required: ${jobContext.skills?.join(", ") || "General Technical Skills"}
        
        Your Goal: Conduct a realistic, tough but fair technical interview.
        
        Guidelines:
        1. Start by introducing yourself and asking the candidate to introduce themselves if it's the start.
        2. Ask one question at a time.
        3. Mix of conceptual questions, code snippets (ask them to explain output or find bugs), and situational questions.
        4. If the candidate answers correctly, acknowledge briefly and move to a harder question.
        5. If incorrect, politely correct them and explain the concept briefly before moving on.
        6. Keep responses concise and conversational.
        7. Ask 1-2 Multiple Choice Questions (MCQs) during the session to test specific knowledge.
        
        Maintain a professional yet encouraging tone.
        `;

        const groq = new Groq({ apiKey });

        const finalMessages = [
            { role: "system", content: systemPrompt },
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
        console.error("Interview API Error:", error);
        return NextResponse.json({ error: "Failed to process interview request" }, { status: 500 });
    }
}
