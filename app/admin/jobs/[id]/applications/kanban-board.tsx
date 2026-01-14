"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { updateApplicationStatus } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Application {
    id: string;
    userId: string;
    studentName?: string;
    studentCgpa?: string;
    studentBranch?: string;
    status: string;
    appliedAt: Date | string;
}

const COLUMNS = [
    { id: "Applied", title: "Applied", color: "bg-blue-100" },
    { id: "Under Review", title: "Under Review", color: "bg-amber-100" },
    { id: "Interview Scheduled", title: "Interview", color: "bg-purple-100" },
    { id: "Selected", title: "Selected", color: "bg-emerald-100" },
    { id: "Rejected", title: "Rejected", color: "bg-red-100" },
];

export function KanbanBoard({ initialApplications, jobId }: { initialApplications: Application[], jobId: string }) {
    const [applications, setApplications] = useState<Application[]>(initialApplications);
    const [activeId, setActiveId] = useState<string | null>(null);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const applicationId = active.id as string;
        const newStatus = over.id as string;

        const currentApp = applications.find(app => app.id === applicationId);
        if (!currentApp || currentApp.status === newStatus) return;

        // Optimistic Update
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            )
        );

        // API Call
        try {
            const result = await updateApplicationStatus(applicationId, newStatus, jobId);
            if (!result.success) {
                // Revert on failure
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === applicationId ? { ...app, status: currentApp.status } : app
                    )
                );
                alert("Failed to update status: " + result.message);
            }
        } catch (error) {
            console.error(error);
            // Revert on error
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId ? { ...app, status: currentApp.status } : app
                )
            );
            alert("An error occurred while updating status.");
        }
    };

    const activeApplication = activeId ? applications.find(app => app.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-200px)] overflow-x-auto gap-4 pb-4">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        colorClass={col.color}
                        applications={applications.filter((app) => app.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeApplication ? (
                    <KanbanCard application={activeApplication} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
