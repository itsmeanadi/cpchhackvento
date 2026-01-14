"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";

interface Application {
    id: string;
    userId: string;
    studentName?: string;
    studentCgpa?: string;
    studentBranch?: string;
    status: string;
    appliedAt: Date | string;
}

interface KanbanColumnProps {
    id: string;
    title: string;
    applications: Application[];
    colorClass: string;
}

export function KanbanColumn({ id, title, applications, colorClass }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-[280px] bg-gray-50 rounded-xl border border-gray-200">
            {/* Header */}
            <div className={`p-3 border-b border-gray-100 rounded-t-xl ${colorClass} bg-opacity-30`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                    <span className="bg-white/50 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {applications.length}
                    </span>
                </div>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px]">
                {applications.map((app) => (
                    <KanbanCard key={app.id} application={app} />
                ))}
            </div>
        </div>
    );
}
