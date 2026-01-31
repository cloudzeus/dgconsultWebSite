"use client";

import { useState } from "react";
import { Sector } from "@prisma/client";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, Home, Power, PowerOff } from "lucide-react";
import { updateSectorsOrder, deleteSector } from "./actions";
import { toast } from "sonner";
import { SectorModal } from "./SectorModal";

interface SortableSectorListProps {
    initialItems: Sector[];
}

export function SortableSectorList({ initialItems }: SortableSectorListProps) {
    const [items, setItems] = useState(initialItems);
    const [editingItem, setEditingItem] = useState<Sector | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            // Update order in DB
            const updates = newItems.map((item, index) => ({
                id: item.id,
                sortOrder: index + 1,
            }));

            try {
                const res = await updateSectorsOrder(updates);
                if (!res.success) toast.error("Failed to update order");
            } catch {
                toast.error("Failed to update order");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this sector?")) {
            const res = await deleteSector(id);
            if (res.success) {
                setItems(items.filter(item => item.id !== id));
                toast.success("Deleted successfully");
            } else {
                toast.error(res.error);
            }
        }
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-[#D32F2F] hover:bg-[#B71C1C]">
                    New Sector
                </Button>
            </div>

            <div className="bg-white rounded-md border">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <SortableContext
                                items={items.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((item) => (
                                    <SortableRow key={item.id} item={item} onEdit={() => { setEditingItem(item); setIsModalOpen(true); }} onDelete={() => handleDelete(item.id)} />
                                ))}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <SectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sector={editingItem}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </>
    );
}

function SortableRow({ item, onEdit, onDelete }: { item: Sector; onEdit: () => void; onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-[50px]">
                <button {...attributes} {...listeners} className="cursor-grab hover:text-gray-600">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                </button>
            </TableCell>
            <TableCell>
                {item.featuredImage ? (
                    <div className="relative w-12 h-8 rounded overflow-hidden bg-gray-100">
                        <img
                            src={item.featuredImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-[10px] text-gray-400">No img</span>
                    </div>
                )}
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell className="text-gray-500 font-mono text-xs">{item.slug}</TableCell>
            <TableCell>
                {item.isFeatured ? (
                    <Home className="h-4 w-4 text-blue-500" />
                ) : (
                    <span className="text-gray-300">-</span>
                )}
            </TableCell>
            <TableCell>
                {item.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Power className="h-3 w-3" /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <PowerOff className="h-3 w-3" /> Inactive
                    </span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
