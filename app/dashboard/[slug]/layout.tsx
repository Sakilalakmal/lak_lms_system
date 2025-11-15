import { getCourseSideBarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSideBar } from "../_components/CourseSideBar";

interface courseLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function courseLayout({
  params,
  children,
}: courseLayoutProps) {
  const { slug } = await params;

  const course = await getCourseSideBarData(slug);

  return (
    <div className="flex flex-1">
      {/* Sidebar would go here in future 30% */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSideBar course={course.course} />
      </div>

      {/* Main content area 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
