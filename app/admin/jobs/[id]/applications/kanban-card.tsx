"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Application {
    id: string;
    userId: string;
    studentName?: string;
    studentCgpa?: string;
    studentBranch?: string;
    status: string;
    appliedAt: Date | string;
}

export function KanbanCard({ application }: { application: Application }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: application.id,
        data: {
            application,
            type: "Application",
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            itemProp="application-card"
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative"
            {...attributes}
            {...listeners}
        >
            <div className="absolute top-3 right-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} />
            </div>

            <div className="pr-4">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                    {application.studentName || application.userId}
                </h4>
                {application.studentName && (
                    <p className="text-xs text-gray-500 truncate mb-1">{application.userId}</p>
                )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex flex-col">
                    {application.studentBranch && <span>{application.studentBranch}</span>}
                    {application.studentCgpa && <span>CGPA: {application.studentCgpa}</span>}
                </div>
            </div>

            <div className="mt-2 text-xs text-gray-400 text-right">
                {new Date(application.appliedAt).toLocaleDateString()}
            </div>
        </div>
    );
}
