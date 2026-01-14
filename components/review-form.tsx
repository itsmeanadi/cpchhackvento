"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { postReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    companyName: string;
}

export function ReviewForm({ companyName }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage({ type: 'error', text: "Please select a rating." });
            return;
        }
        if (!content.trim()) {
            setMessage({ type: 'error', text: "Please write a review." });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        const res = await postReview(companyName, rating, content);

        if (res.success) {
            setMessage({ type: 'success', text: res.message });
            setContent("");
            setRating(0);
            router.refresh(); // Refresh to show new review
        } else {
            setMessage({ type: 'error', text: res.message || "Failed to submit." });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={24}
                                className={cn(
                                    "transition-colors",
                                    (hoverRating || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-neutral-600"
                                )}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-neutral-400">
                        {rating > 0 ? `${rating}/5` : "Select rating"}
                    </span>
                </div>

                {/* Text Area */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your interview experience and advice for juniors..."
                    rows={4}
                    className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />

                {/* Message */}
                {message && (
                    <p className={cn("text-sm", message.type === 'success' ? "text-emerald-400" : "text-red-400")}>
                        {message.text}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Post Review
                </button>
            </form>
        </div>
    );
}
