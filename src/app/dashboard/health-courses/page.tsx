
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Keep Card for course items
import { PlayCircle } from "lucide-react";
import Image from "next/image";

const mockCourses = [
  { id: "hc001", title: "糖尿病自我管理基础", description: "学习如何通过饮食、运动和药物有效管理糖尿病。", category: "糖尿病", duration: "4周", imageUrl: "https://picsum.photos/seed/course1/300/200", dataAiHint: "diabetes education" },
  { id: "hc002", title: "高血压的日常调理与预防", description: "了解高血压的成因、危害以及日常生活中的降压技巧。", category: "高血压", duration: "3周", imageUrl: "https://picsum.photos/seed/course2/300/200", dataAiHint: "hypertension care"},
  { id: "hc003", title: "心脏健康饮食指南", description: "探索有益心脏健康的食物选择和烹饪方法。", category: "心脏健康", duration: "2周", imageUrl: "https://picsum.photos/seed/course3/300/200", dataAiHint: "healthy eating" },
];

export default function HealthCoursesPage() {
  return (
    <div className="space-y-4">
      {mockCourses.length > 0 ? (
        <div className="space-y-4"> {/* Changed grid to space-y for single column on mobile */}
          {mockCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Image 
                src={course.imageUrl} 
                alt={course.title} 
                width={300} 
                height={160} // Reduced height for mobile
                className="w-full h-40 object-cover" // Adjusted height
                data-ai-hint={course.dataAiHint || "health course"}
              />
              <CardHeader className="p-3">
                <CardTitle className="text-base font-semibold line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="text-xs">{course.category} | {course.duration}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-3">{course.description}</p>
              </CardContent>
              <CardContent className="border-t p-3">
                 <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center disabled:opacity-50 h-9" disabled>
                    <PlayCircle className="mr-1.5 h-4 w-4" /> 开始学习 (建设中)
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
                <PlayCircle className="mx-auto h-16 w-16 text-primary/30 mb-3" />
                <h3 className="text-md font-semibold text-foreground/70">课程内容即将上线</h3>
                <p className="text-foreground/50 text-xs max-w-xs mx-auto">
                我们正在精心准备更多健康教育课程，敬请期待。
                </p>
            </CardContent>
        </Card>
      )}
       <p className="text-xs text-muted-foreground text-center pt-2">健康教育课程模块 (此页面内容正在建设中)。</p>
    </div>
  );
}
