"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Mail, Bell, CheckSquare, Square, Loader2, Filter } from "lucide-react";

interface Student {
    email: string;
    name: string;
    fcmToken?: string;
    cgpa?: string;
    branch?: string;
}

export default function NotificationsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [channels, setChannels] = useState({ email: true, push: true });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    // Filters & Sorting
    const [minCgpa, setMinCgpa] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "cgpa" | "branch">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Derived state
    const branches = Array.from(new Set(students.map(s => s.branch).filter(Boolean))) as string[];

    useEffect(() => {
        fetch("/api/users/students")
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => console.error(err));
    }, []);

    const filteredStudents = students
        .filter(student => {
            // 1. Min CGPA Filter
            if (minCgpa) {
                const sCgpa = parseFloat(student.cgpa || "0");
                const mCgpa = parseFloat(minCgpa);
                if (!isNaN(mCgpa) && sCgpa < mCgpa) return false;
            }
            // 2. Branch Filter
            if (selectedBranch && student.branch !== selectedBranch) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            let valA, valB;

            switch (sortBy) {
                case "cgpa":
                    valA = parseFloat(a.cgpa || "0");
                    valB = parseFloat(b.cgpa || "0");
                    break;
                case "branch":
                    valA = a.branch || "";
                    valB = b.branch || "";
                    break;
                case "name":
                default:
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    const toggleSelectAll = () => {
        const filteredEmails = filteredStudents.map(s => s.email);
        const allSelected = filteredEmails.every(email => selectedStudents.includes(email));

        if (allSelected) {
            // Deselect visible
            setSelectedStudents(selectedStudents.filter(email => !filteredEmails.includes(email)));
        } else {
            // Select all visible (union)
            const newSelection = new Set([...selectedStudents, ...filteredEmails]);
            setSelectedStudents(Array.from(newSelection));
        }
    };

    const toggleStudent = (email: string) => {
        if (selectedStudents.includes(email)) {
            setSelectedStudents(selectedStudents.filter(e => e !== email));
        } else {
            setSelectedStudents([...selectedStudents, email]);
        }
    };

    const handleSend = async () => {
        if (selectedStudents.length === 0) return alert("Select at least one student.");
        if (!subject || !message) return alert("Subject and message are required.");

        setStatus("sending");
        setIsLoading(true);

        try {
            const res = await fetch("/api/send-notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentIds: selectedStudents,
                    subject,
                    message,
                    channels: Object.keys(channels).filter(k => channels[k as keyof typeof channels])
                })
            });

            if (!res.ok) throw new Error("Failed to send");

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
            setSubject("");
            setMessage("");
            setSelectedStudents([]);

        } catch (error) {
            console.error(error);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold">Broadcast Notifications</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">

                    {/* Filter Section */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Select Recipients</h3>
                            <button onClick={toggleSelectAll} className="text-xs text-indigo-600 font-medium hover:underline">
                                {filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.includes(s.email)) ? "Deselect Visible" : "Select Visible"}
                            </button>
                        </div>

                        {/* Branch Filter */}
                        <div className="relative">
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                                <option value="">All Branches</option>
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        {/* CGPA Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="number"
                                placeholder="Min CGPA (e.g. 7.5)"
                                value={minCgpa}
                                onChange={(e) => setMinCgpa(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Sort Controls */}
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "name" | "cgpa" | "branch")}
                                className="w-1/2 px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                                <option value="name">Name</option>
                                <option value="cgpa">CGPA</option>
                                <option value="branch">Branch</option>
                            </select>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                                className="w-1/2 px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {students.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">Loading students...</div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">No students match filter.</div>
                        ) : (
                            filteredStudents.map(student => (
                                <div
                                    key={student.email}
                                    onClick={() => toggleStudent(student.email)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedStudents.includes(student.email) ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
                                >
                                    {selectedStudents.includes(student.email) ?
                                        <CheckSquare size={18} className="text-indigo-600" /> :
                                        <Square size={18} className="text-gray-300" />
                                    }
                                    <div className="overflow-hidden w-full">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium truncate text-gray-900">{student.name}</p>
                                            {student.cgpa && <span className="text-[10px] bg-green-50 text-green-700 px-1.5 rounded font-medium">{student.cgpa}</span>}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
                                            <p className="truncate max-w-[120px]">{student.email}</p>
                                            {student.branch && <span className="text-[10px] bg-gray-100 px-1.5 rounded">{student.branch}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center flex justify-between">
                        <span>{filteredStudents.length} visible</span>
                        <span className="font-medium text-indigo-600">{selectedStudents.length} selected</span>
                    </div>
                </div>

                {/* RIGHT: Composer */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6">Compose Message</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Important Update: Interview Schedule"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    rows={8}
                                    placeholder="Enter your message here..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={channels.email}
                                        onChange={e => setChannels(c => ({ ...c, email: e.target.checked }))}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 flex items-center gap-2"><Mail size={16} /> Email (Gmail)</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={channels.push}
                                        onChange={e => setChannels(c => ({ ...c, push: e.target.checked }))}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 flex items-center gap-2"><Bell size={16} /> Push Notification</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || status === 'success'}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${status === 'success' ? 'bg-green-600 text-white cursor-default' :
                            'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                            }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> :
                            status === 'success' ? 'Notifications Sent!' :
                                <><Send size={18} /> Send Broadcast</>}
                    </button>

                </div>
            </main>
        </div>
    );
}
