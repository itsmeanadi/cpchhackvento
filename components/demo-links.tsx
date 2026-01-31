"use client";

import { Youtube, FolderOpen, ExternalLink } from "lucide-react";

export function PrototypeDemoLinks() {
    const links = [
        {
            label: "Video Pitch",
            url: "https://youtu.be/YD6HEPaqqqU",
            icon: <Youtube size={16} className="text-red-500" />,
            description: "YouTube Demo"
        },
        {
            label: "Project Drive",
            url: "https://drive.google.com/drive/folders/1MFQhcEdBPjsOMZbINlyWSBo-xjQ_NYta",
            icon: <FolderOpen size={16} className="text-blue-400" />,
            description: "Original Assets"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {links.map((link) => (
                <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center p-4 bg-white/5 border border-white/[0.05] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 space-y-2 text-center"
                >
                    <div className="p-2 bg-neutral-950 rounded-lg group-hover:scale-110 transition-transform">
                        {link.icon}
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                            {link.label}
                        </div>
                        <div className="text-[9px] text-neutral-500 font-medium">
                            {link.description}
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
