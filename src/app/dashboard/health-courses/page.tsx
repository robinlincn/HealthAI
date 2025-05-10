
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, PlayCircle } from "lucide-react";
import Image from "next/image";

const mockCourses = [
  { id: "hc001", title: "糖尿病自我管理基础", description: "学习如何通过饮食、运动和药物有效管理糖尿病。", category: "糖尿病", duration: "4周", imageUrl: "https://picsum.photos/seed/course1/300/200", dataAiHint: "diabetes education" },
  { id: "hc002", title: "高血压的日常调理与预防", description: "了解高血压的成因、危害以及日常生活中的降压技巧。", category: "高血压", duration: "3周", imageUrl: "https://picsum.photos/seed/course2/300/200", dataAiHint: "hypertension care"},
  { id: "hc003", title: "心脏健康饮食指南", description: "探索有益心脏健康的食物选择和烹饪方法。", category: "心脏健康", duration: "2周", imageUrl: "https://picsum.photos/seed/course3/300/200", dataAiHint: "healthy eating" },
];

export default function HealthCoursesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            健康教育课程
          </CardTitle>
          <CardDescription>
            学习专业的健康知识和管理技巧，提升自我健康管理能力。 (此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
      </Card>

      {mockCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <Image 
                src={course.imageUrl} 
                alt={course.title} 
                width={300} 
                height={200} 
                className="w-full h-48 object-cover"
                data-ai-hint={course.dataAiHint || "health course"}
              />
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="text-xs">{course.category} | {course.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
              </CardContent>
              <CardContent className="border-t pt-4">
                 <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center disabled:opacity-50" disabled>
                    <PlayCircle className="mr-2 h-5 w-5" /> 开始学习 (建设中)
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="py-16 text-center">
                <BookOpen className="mx-auto h-24 w-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">课程内容即将上线</h3>
                <p className="text-foreground/50 max-w-md mx-auto">
                我们正在精心准备更多健康教育课程，涵盖糖尿病管理、高血压预防等方面，敬请期待。
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
