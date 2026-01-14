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
        1. Start by introducing yourself and asking the candidate to introduce themselves.
        2. FOR EVERY USER ANSWER (except the initial introduction), you MUST follow this EXACT format:
           
           **Your Answer Score:** [0-10]/10
           **Improved Version:** [A concise, better way to answer the previous question]
           **Next Question:** [Your next technical or situational question]

        3. If the user's answer is correct, give a high score and briefly explain why.
        4. If incorrect, give a low score, explain the concept in "Improved Version".
        5. Keep the "Improved Version" concise (2-3 sentences).
        6. Ask 1-2 Multiple Choice Questions (MCQs) randomly during the session.
        
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
