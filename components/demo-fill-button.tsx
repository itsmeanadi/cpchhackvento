"use client";

import { Wand2 } from "lucide-react";

export function DemoFillButton() {
  const handleFill = () => {
    // Helper to safely set value
    const setVal = (name: string, value: string) => {
      const el = document.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (el) {
        el.value = value;
        // Trigger change event for any listeners (if any)
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    // [User Data] Mapped from your portfolio context
    setVal("phone", "+91 98765 43210"); // Placeholder phone
    setVal("dob", "2003-08-15"); // Approx date based on student profile
    setVal("gender", "Male");
    setVal("branch", "CSE");
    setVal("cgpa", "8.92");
    setVal("backlogs", "0");
    setVal("tenthMarks", "94.5");
    setVal("twelfthMarks", "91.2");
    
    // Tech Stack from your readme
    setVal("skills", "TypeScript, React, Next.js, Java, C++, Firebase, MongoDB, Tailwind CSS, System Design");
    
    // Your actual social links
    setVal("resumeUrl", "https://drive.google.com/file/d/demo-resume-link/view");
    setVal("linkedinUrl", "https://www.linkedin.com/in/anadi-sharma-b2ba0b32b/");
    setVal("githubUrl", "https://github.com/itsmeanadi");
  };

  return (
    <button
      type="button"
      onClick={handleFill}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-95"
      title="Auto-fill Anadi's Data"
    >
      <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
      <span>Demo Data</span>
    </button>
  );
}