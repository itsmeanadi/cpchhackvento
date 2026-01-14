"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, ArrowLeft, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InterviewChatProps {
    job: any;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function InterviewChat({ job }: InterviewChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Interview
    useEffect(() => {
        if (!hasInitialized.current && job) {
            hasInitialized.current = true;
            const initialMsg = `Hello! I am the AI Technical Interviewer for ${job.companyName}. I'm here to interview you for the ${job.role} role. To begin, could you please introduce yourself briefly?`;
            setMessages([{ role: "assistant", content: initialMsg }]);
        }
    }, [job]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
            chatHistory.push({ role: "user", content: userMessage });

            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatHistory,
                    jobContext: {
                        companyName: job.companyName,
                        role: job.role,
                        skills: job.skills // Assuming job object has skills
                    }
                }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error. Please try again." }]);
            }
        } catch (error) {
            console.error("Interview Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your internet." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="text-indigo-400" />
                        AI Mock Interview
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {job.companyName} • {job.role}
                    </p>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-medium animate-pulse">
                    Live Session
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex gap-4 max-w-3xl",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/5",
                                msg.role === "user" ? "bg-neutral-800 text-white" : "bg-indigo-600 text-white"
                            )}
                        >
                            {msg.role === "user" ? <User size={18} /> : <Bot size={20} />}
                        </div>

                        <div
                            className={cn(
                                "p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm max-w-[85%]",
                                msg.role === "user"
                                    ? "bg-neutral-800 text-white rounded-tr-none border border-neutral-700"
                                    : "bg-indigo-900/20 text-indigo-100 border border-indigo-500/20 rounded-tl-none"
                            )}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 max-w-3xl">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-600 text-white shadow-lg border border-white/5">
                            <Bot size={20} />
                        </div>
                        <div className="bg-indigo-900/20 p-4 rounded-2xl rounded-tl-none border border-indigo-500/20">
                            <Loader2 size={20} className="animate-spin text-indigo-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-neutral-900/80 border border-neutral-800 text-white text-base rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
