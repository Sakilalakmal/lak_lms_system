"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminSingleCourseType } from "@/app/data/admin/admin-get-course";
import { listeners, title } from "process";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  FileTextIcon,
  GripVertical,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../action";
import { NewChapterModel } from "./NewChapterModel";

interface CourseStructureProps {
  data: AdminSingleCourseType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string; //only for chapters
    lessonId?: string; //only for lessons
  };
}

export function CourseStructure({ data }: CourseStructureProps) {
  const initalItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lesson.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })), //default chapter open
    })) || [];
  const [items, setItems] = useState(initalItems);

  useEffect(() => {
    setItems((prev) => {
      const updatedItems =
        data.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: prev.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lesson.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updatedItems;
    });
  }, [data]);

  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error(" Can't be reordering this chapter");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error(" Can't be reordering this chapter");
        return;
      }

      const reorderLocalChapters = arrayMove(items, oldIndex, newIndex);

      const updatedChapterForState = reorderLocalChapters.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const previousItems = [...items];

      setItems(updatedChapterForState);

      if (courseId) {
        const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reorderChaptersPromise = () =>
          reorderChapters(courseId, chaptersToUpdate);
        toast.promise(reorderChaptersPromise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters.";
          },
        });
      }

      return;
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error(" Lessons can only be reordered within the same chapter");
        return;
      }

      const chapterIndex = items.findIndex((item) => item.id === chapterId);
      if (chapterIndex === -1) {
        toast.error(" Can't be find this chapter to reorder lessons...");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error(" Can't be reordering this lesson");
        return;
      }

      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonsForState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonsForState,
      };

      const previousItems = [...items];
      setItems(newItems);

      if (courseId) {
        const lessonsToUpdate = updatedLessonsForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reorderLessonPromise = () =>
          reorderLessons(chapterId, lessonsToUpdate, courseId);
        toast.promise(reorderLessonPromise(), {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder lessons.";
          },
        });
      }

      return;
    }
  }

  function toggleChapterOpen(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  // sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex items-center flex-row justify-between border-b border-border">
          <CardTitle>Chapters </CardTitle>
          <NewChapterModel courseId={data.id} />
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                id={item.id}
                data={{ type: "chapter" }}
                key={item.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapterOpen(item.id)}
                    >
                      <div className="flex items-center p-3 border-b border-border justify-between">
                        <div className="flex items-center  gap-2">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="cursor-grab opacity-50 hover:opacity-100"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>

                          <CollapsibleTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>

                        <Button>
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"secondary"}
                                        size={"icon"}
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileTextIcon className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>

                                    <Button variant={"destructive"}>
                                      <Trash2Icon className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button variant={"outline"} className="w-full">
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
