"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Video, MapPin, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Interview {
  id: string;
  companyName: string;
  interviewType: string;
  dateTime: any;
  duration: number;
  meetingLink: string;
  notes: string;
  status: string;
}

export default function InterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/calendar");
      const data = await response.json();
      
      if (data.success) {
        setInterviews(data.interviews || []);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CheckCircle2 className="text-green-500" size={20} />;
      case "completed":
        return <CheckCircle2 className="text-blue-500" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const formatDateTime = (dateTime: any) => {
    try {
      if (!dateTime) return "Date not available";
      const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
      if (isNaN(date.getTime())) return "Invalid date";
      return format(date, "PPP 'at' p");
    } catch {
      return "Date not available";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-neutral-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Schedule</h1>
              <p className="text-neutral-400">Your upcoming interviews and meeting details</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
              <Calendar className="text-indigo-400" size={18} />
              <span className="text-sm font-medium">{interviews.length} Scheduled</span>
            </div>
          </div>
        </div>

        {/* Interviews List */}
        {interviews.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <Calendar className="mx-auto mb-4 text-neutral-600" size={48} />
            <h3 className="text-xl font-medium text-neutral-300 mb-2">No Interviews Scheduled</h3>
            <p className="text-neutral-500">Your upcoming interviews will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center shrink-0">
                        <span className="text-indigo-400 font-bold text-lg">
                          {interview.companyName.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {interview.companyName}
                          </h3>
                          <span className="text-xs font-medium bg-indigo-600/10 text-indigo-400 px-2 py-1 rounded uppercase border border-indigo-600/20">
                            {interview.interviewType}
                          </span>
                          {getStatusIcon(interview.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <Calendar size={16} />
                            <span>{formatDateTime(interview.dateTime)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <Clock size={16} />
                            <span>{interview.duration} minutes</span>
                          </div>
                          
                          {interview.meetingLink && (
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                              <Video size={16} />
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>

                        {interview.notes && (
                          <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                            <p className="text-xs text-neutral-400">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2">
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-center flex items-center gap-2 justify-center"
                      >
                        <Video size={16} />
                        Join Now
                      </a>
                    )}
                    
                    {interview.status === "scheduled" && (
                      <button
                        onClick={() => {
                          try {
                            if (interview.dateTime) {
                              const date = typeof interview.dateTime === 'string' 
                                ? new Date(interview.dateTime) 
                                : interview.dateTime;
                              
                              // Validate date
                              if (isNaN(date.getTime())) {
                                alert("Invalid date format");
                                return;
                              }
                              
                              const endDate = new Date(date.getTime() + interview.duration * 60000);
                              
                              const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                                `Interview - ${interview.companyName}`
                              )}&dates=${format(date, "yyyyMMdd'T'HHmmss")}/${format(
                                endDate,
                                "yyyyMMdd'T'HHmmss"
                              )}&details=${encodeURIComponent(
                                interview.notes || `${interview.interviewType} interview`
                              )}&location=${encodeURIComponent(interview.meetingLink || "")}`;
                              
                              window.open(googleCalendarUrl, "_blank");
                            }
                          } catch (error) {
                            console.error("Calendar error:", error);
                            alert("Failed to create calendar event");
                          }
                        }}
                        className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700 flex items-center gap-2 justify-center"
                      >
                        <Calendar size={16} />
                        Add to Calendar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
