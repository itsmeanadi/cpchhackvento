import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import mammoth from "mammoth";

// Lazy loading imports moved inside handler to prevent top-level crashes

export async function POST(req: NextRequest) {
    console.log("--- Resume Analysis Request Started ---");

    try {
        // 1. Validate API Keys
        const geminiKey = process.env.GOOGLE_API_KEY;
        const groqKey = process.env.GROQ_API_KEY;

        console.log("Gemini Key present:", !!geminiKey);
        console.log("Groq Key present:", !!groqKey);

        if (!geminiKey && !groqKey) {
            console.error("Missing Both API Keys");
            return NextResponse.json({ error: "Server Configuration Error: Missing AI API Keys" }, { status: 500 });
        }

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("No file found in request");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`File received: ${file.name} (${file.type}, ${file.size} bytes)`);

        // 3. Extract Text
        let text = "";
        const buffer = Buffer.from(await file.arrayBuffer());

        try {
            if (file.type === "application/pdf") {
                console.log("Parsing PDF with pdf2json...");
                const PDFParser = require("pdf2json");
                const pdfParser = new PDFParser(null, 1); // 1 = Text mode

                text = await new Promise((resolve, reject) => {
                    pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
                    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                        // Extract text from the raw data
                        const rawText = pdfParser.getRawTextContent();
                        resolve(rawText);
                    });
                    pdfParser.parseBuffer(buffer);
                });

                // Cleaning up text
                text = text.replace(/\0/g, "").trim();
                console.log(`PDF Parsed. Text Length: ${text.length}`);

            } else if (
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.name.endsWith(".docx")
            ) {
                console.log("Parsing DOCX...");
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
                console.log(`DOCX Parsed. Text Length: ${text.length}`);

            } else if (file.type === "text/plain") {
                console.log("Reading Text file...");
                text = buffer.toString("utf-8");
                console.log(`TXT Read. Text Length: ${text.length}`);

            } else {
                console.warn("Unsupported file format:", file.type);
                return NextResponse.json({ error: "Unsupported file format. Please upload PDF, DOCX, or TXT." }, { status: 400 });
            }
        } catch (parseError: any) {
            console.error("File Parsing Failed:", parseError);
            return NextResponse.json({ error: `Failed to read file content: ${parseError.message}` }, { status: 400 });
        }

        if (!text || text.length < 50) {
            console.warn("Extracted text is too short.");
            // More specific error for PDFs
            if (file.type === "application/pdf") {
                return NextResponse.json({
                    error: "The PDF appears to be empty or contains scanned images instead of text. Please upload a text-based PDF or a DOCX file."
                }, { status: 400 });
            }
            return NextResponse.json({ error: "Could not extract enough text from the file (minimum 50 chars)." }, { status: 400 });
        }

        // 4. AI Analysis (Gemini -> Fallback to Groq)
        const prompt = `
            You are an expert Resume Analyzer and Career Coach. 
            Analyze the following resume text.
            Resume Text: "${text.slice(0, 10000)}" 
            
            Provide structured output strictly in this JSON format:
            {
                "score": number (0-100),
                "summary": "Brief professional summary of the candidate",
                "strengths": ["string", "string"],
                "weaknesses": ["string", "string"],
                "suggestions": ["string", "string"],
                "atsCheck": {
                    "missingKeywords": ["string", "string"],
                    "formattingIssues": ["string", "string"]
                }
            }
            Return ONLY the valid JSON object. No markdown blocks.
        `;

        let analysis;
        let usedModel = "gemini";

        // Try Gemini First
        if (geminiKey) {
            try {
                console.log("Attempting Gemini Analysis...");
                const genAI = new GoogleGenerativeAI(geminiKey);
                // Use gemini-pro as it is more stable than flash
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let jsonString = response.text();

                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
                analysis = JSON.parse(jsonString);
                console.log("Gemini Analysis Successful");
            } catch (geminiError) {
                console.error("Gemini Failed:", geminiError);
                // Fallback will happen below
            }
        }

        // Fallback to Groq if Gemini failed or key missing
        if (!analysis && groqKey) {
            try {
                console.log("Falling back to Groq Analysis...");
                usedModel = "groq";
                const groq = new Groq({ apiKey: groqKey });

                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.1,
                });

                let jsonString = completion.choices[0]?.message?.content || "";
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

                // Heuristic: sometimes models add text before/after JSON
                const firstBrace = jsonString.indexOf("{");
                const lastBrace = jsonString.lastIndexOf("}");
                if (firstBrace !== -1 && lastBrace !== -1) {
                    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
                }

                analysis = JSON.parse(jsonString);
                console.log("Groq Analysis Successful");

            } catch (groqError) {
                console.error("Groq Failed:", groqError);
                return NextResponse.json({ error: "Both AI services failed. Please try again later." }, { status: 502 });
            }
        }

        if (!analysis) {
            return NextResponse.json({ error: "Analysis failed. Please check server logs." }, { status: 500 });
        }

        return NextResponse.json({ success: true, analysis, source: usedModel });

    } catch (error: any) {
        console.error("Resume Analysis Critical Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze resume" },
            { status: 500 }
        );
    }
}
