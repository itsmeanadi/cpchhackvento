"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Video, User, CheckCircle } from "lucide-react";

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    studentEmail: "",
    companyName: "",
    interviewType: "technical",
    dateTime: "",
    duration: 60,
    meetingLink: "",
    notes: "",
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Simple regex to find the first email in the CSV
        const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (emailMatch && emailMatch[0]) {
          setFormData((prev) => ({ ...prev, studentEmail: emailMatch[0] }));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          scheduledBy: "admin",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        alert(data.error || "Failed to schedule interview");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Scheduled!</h2>
          <p className="text-gray-500 mb-8">
            Successfully scheduled interview for {formData.studentEmail}
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new interview schedule for a student
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    companyName: "Google",
                    interviewType: "technical",
                    dateTime: "2026-01-15T10:00",
                    duration: 60,
                    meetingLink: "https://meet.google.com/abc-def-ghi",
                    notes: "Technical interview - Data Structures and Algorithms",
                  })
                }
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
              >
                Autofill Form
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Student Details */}
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                Student Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    placeholder="student@ietdavv.edu.in"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Interview Details */}
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                Interview Details
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    placeholder="e.g. Google, Microsoft"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-white"
                    value={formData.interviewType}
                    onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                  >
                    <option value="technical">Technical</option>
                    <option value="hr">HR</option>
                    <option value="coding">Coding Round</option>
                    <option value="aptitude">Aptitude</option>
                    <option value="group-discussion">Group Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      required
                      type="datetime-local"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      value={formData.dateTime}
                      onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      required
                      type="number"
                      min="15"
                      step="15"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Any specific instructions or topics to prepare..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
              >
                {isLoading ? "Scheduling Interview..." : "Schedule Interview"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
